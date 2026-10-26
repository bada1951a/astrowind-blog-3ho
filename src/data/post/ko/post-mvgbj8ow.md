---
title: "구글 시트 주간 PDF 보고서 자동 발송: 야근 탈출 앱스 스크립트 작성법"
description: "서울 판교 IT 기업 직장인들을 위한 구글 시트 주간 PDF 보고서 자동 이메일 발송 앱스 스크립트 작성법. 야근을 방지하는 실무 자동화 가이드."
publishDate: 2026-10-20T08:30:00.000Z
image: 'https://picsum.photos/seed/work-mvgbj8ox-0-c/1200/675.jpg'
category: 'automation'
tags: ["Google Sheets", "Apps Script", "Automation", "Office Tips", "PDF Report"]
theme: "Industrial Blueprint"
---

## 1. 직장인 멘붕 오는 업무 병목 돌발 상황

시계 바늘이 금요일 오후 5시 40분을 가리키고 있습니다. 판교의 한 IT 기업 사무실, 주간 실적 보고 마감을 불과 20분 앞둔 상황에서 제 모니터 앞은 전쟁터나 다름없었습니다. 팀장님께 제출할 주간 성과 보고서를 구글 시트로 작성해 놓고, 매주 금요일 퇴근 직전마다 수동으로 엑셀 파일을 PDF로 변환하고, 메일 창을 열어 첨부하고, 수신자 지정해서 보내는 반복 작업을 하다가 그만 중요한 지표 셀을 잘못 건드려 데이터가 엉망이 되어버렸습니다. 

당장 야근 확정이라는 불안감이 엄습했고, '이 단순 반복 작업을 왜 매주 사람이 직접 하고 있어야 하지?'라는 강한 의문이 들었습니다. 이 문제를 해결하기 위해 구글 앱스 스크립트(Google Apps Script)를 활용해 주간 보고서 PDF 자동 이메일 발송 시스템을 구축했고, 지금은 금요일 6시 정각에 컴퓨터가 알아서 보고서를 발송하고 저는 칼퇴근을 누리고 있습니다. 오늘은 여러분께 그 실무 치트키를 가이드해 드리겠습니다.

<div style="border-left: 4px solid #f59e0b; padding: 12px 16px; margin: 20px 0; background-color: rgba(0,0,0,0.03); border-radius: 4px; color: #111827;">
<strong>실무 전문가의 자동화 요약 청사진:</strong> 구글 시트(Data Source)와 앱스 스크립트(Engine), 그리고 지메일(Delivery)을 결합하여 매주 정해진 시간에 구글 드라이브에 PDF를 생성하고 첨부 파일로 발송하는 3단계 워크플로우를 완성합니다.
</div>

---

## 1. 주간 보고서 수동 발송 시 발생하는 병목 원인 3가지

매주 반복되는 주간 보고서 업무에서 왜 야근 위기가 찾아오는지, 그 근본적인 원인을 엔지니어링 관점에서 분석해 보겠습니다.

* 휴먼 에러(Human Error) 위험: 마감 직전 급하게 수동으로 PDF를 내보내다 보면 시트 서식이 깨지거나 필터가 걸려 있는 상태로 캡처되어 보고서의 신뢰도가 떨어집니다.
* 시간 자원 낭비(Time Waste): 단순 파일 변환, 메일 작성, 주소 복사-붙여넣기는 지식 노동자의 에너지를 소모하는 대표적인 낭비 요소입니다.
* 타이밍 누락(Timing Omission): 주말 약속이나 연차 등으로 인해 발송 타이밍을 놓치거나 지연되어 사내 커뮤니케이션에 차질이 생깁니다.

---

![How to Write Custom Apps Script to Email Weekly PDF Reports from Google Sheets AI Automation Guide](https://picsum.photos/seed/work-mvgbj8ox-0-b/1000/550.jpg)

## 2. 구글 시트 PDF 자동 이메일 발송 스크립트 구현 3단계

복잡한 코딩 지식은 필요 없습니다. 아래 제공해 드리는 표준 스크립트와 설정 방법만 따라 하시면 10분 만에 자동화 장치를 장착할 수 있습니다.

### [단계 1] 구글 시트 메뉴 진입 및 편집기 열기
1. 자동화할 구글 시트 파일을 엽니다.

2. 상단 메뉴에서 확장 프로그램 > Apps Script를 클릭합니다.

3. 기존에 적혀 있던 코드를 모두 지우고 아래의 실무 최적화 코드를 그대로 붙여넣습니다.

```javascript
function sendWeeklyReportPDF() {
  // 1. 활성 스프레드시트 및 시트 지정
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("보고서시트명"); // 본인의 시트 이름으로 변경하세요
  
  // 2. PDF 내보내기 옵션 설정
  var url = ss.getUrl().replace(/edit$/, '');
  var exportUrl = url + 'export?';
  
  var opts = {
    exportFormat: 'pdf',
    format: 'pdf',
    size: 'A4',
    portrait: 'false', // 가로 방향 (true는 세로)
    fitw: 'true',      // 너비 맞춤
    gridlines: 'false',
    printtitle: 'false',
    sheetnames: 'false',
    gid: sheet.getSheetId()
  };
  
  var urlParts = [];
  for (var opt in opts) {
    urlParts.push(opt + '=' + opts[opt]);
  }
  var optionsUrl = exportUrl + urlParts.join('&');
  
  // 3. OAuth 토큰을 이용한 PDF Blob 생성
  var response = UrlFetchApp.fetch(optionsUrl, {
    headers: {
      'Authorization': 'Bearer ' +  ScriptApp.getOAuthToken(),
      'MuteHttpExceptions': true
    }
  });
  var blob = response.getBlob().setName(sheet.getName() + "_" + Utilities.formatDate(new Date(), "GMT+9", "yyyy-MM-dd") + ".pdf");
  
  // 4. 이메일 발송 설정
  var emailUser = "manager@company.com"; // 수신자 이메일 주소
  var subject = "[주간보고] " + Utilities.formatDate(new Date(), "GMT+9", "yyyy년 MM월 dd일") + " 주간 실적 보고서";
  var body = "안녕하세요,\n\n이번 주 주간 실적 보고서 PDF 첨부하여 송부드립니다.\n상세 내용은 첨부 파일을 확인해 주시기 바랍니다.\n\n감사합니다.";
  
  GmailApp.sendEmail(emailUser, subject, body, {
    attachments: [blob],
    name: "자동 보고서 시스템"
  });
}
```

### [단계 2] 권한 승인 및 테스트 실행
1. 코드 상단의 `저장(디스켓 아이콘)` 버튼을 누릅니다.

2. 상단의 `실행` 버튼을 클릭합니다.

3. 처음 실행 시 '권한 검토' 팝업이 뜹니다. 본인 계정을 선택하고, [고급] > [무제한(안전하지 않음)으로 이동]을 차례대로 클릭한 뒤 권한을 허용합니다. (내가 작성한 내 스크립트이므로 안전합니다.)
4. 지메일 발송함에 정상적으로 메일과 PDF가 첨부되어 들어왔는지 확인합니다.

### [단계 3] 매주 금요일 자동 실행 트리거 설정
1. Apps Script 좌측 메뉴에서 시계 아이콘 모양의 [트리거(Triggers)] 메뉴를 클릭합니다.

2. 우측 하단의 [트리거 추가] 버튼을 누릅니다.

3. 설정 값을 아래와 같이 구성합니다:
   - 실행할 함수 선택: `sendWeeklyReportPDF`
   - 이벤트 소스 선택: 시간 주도(Time-driven)
   - 시간 기반 트리거 유형 선택: 주 단위 타이머(Week timer)
   - 요일 선택: 매주 금요일
   - 시간대 선택: 오후 5시 ~ 오후 6시
4. 저장하면 끝입니다! 이제 매주 금요일 퇴근 시간에 컴퓨터를 켜둘 필요도 없이 구글 서버에서 알아서 메일을 발송해 줍니다.

---

## 3. 실무 적용 시 주의사항 및 에러 방지 팁

<div style="border-left: 4px solid #f59e0b; padding: 12px 16px; margin: 20px 0; background-color: rgba(0,0,0,0.03); border-radius: 4px; color: #111827;">
<strong>전문가 조언:</strong> 구글 앱스 스크립트는 외부 도메인이나 대용량 파일 발송 시 일일 할당량(Quota) 제한이 있습니다. 일반 지메일 계정은 하루 최대 100통, Google Workspace 계정은 최대 1,500통까지 발송 가능하므로 사내 배포 전 수신자 범위를 반드시 확인하세요.
</div>

* 시트 이름 일치시키기: 코드 내의 `"보고서시트명"` 부분은 실제로 데이터가 취합되어 있는 구글 시트 하단의 탭 이름과 정확히 일치해야 합니다. 띄어쓰기 하나만 달라도 에러가 발생합니다.
* 프린트 영역 최적화: PDF로 변환될 때 표가 잘리지 않도록 구글 시트의 [인쇄] 설정에서 '너비에 맞추기' 또는 '셀에 맞추기' 레이아웃 설정을 미리 다듬어 두는 것이 좋습니다.

---

## 4. 자주 묻는 질문 (FAQ)

Q1. 수신자를 여러 명 지정하고 싶을 때는 코드를 어떻게 수정해야 하나요?

A1. `var emailUser = "manager@company.com, boss@company.com";` 형태처럼 쉼표(,)로 구분하여 여러 이메일 주소를 문자열로 입력하거나, 시트의 특정 셀(예: A1 셀)에 이메일 주소들을 적어두고 `sheet.getRange("A1").getValue()`로 불러와 변수에 할당하면 동적으로 수신자를 관리할 수 있습니다.

Q2. 스크립트 실행 시 "Authorization is required" 에러가 계속 뜹니다.

A2. 구글 보안 정책상 최초 실행 시 권한 승인이 필수적입니다. Apps Script 편집기에서 직접 `실행` 버튼을 한 번 눌러 계정 권한을 승인해 주어야 이후 백그라운드 트리거가 정상 작동합니다.

Q3. PDF가 너무 길어서 여러 장으로 쪼개지거나 레이아웃이 깨집니다.

A3. 코드 내 `opts` 객체에서 `portrait: 'false'`(가로 방향) 옵션을 활용하거나, 구글 시트 내에서 인쇄 영역 범위를 사전에 지정(`printArea`)해 두면 깔끔한 한 페이지짜리 보고서 PDF를 얻을 수 있습니다.
