export const EmailHtml = (verifyNum: string) => `<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      .verify {
        height: 100%;
        margin: 0 auto;
        text-align: center;
      }
      .verify > span {
        padding: 1rem 2rem;
        font-size: 2rem;
        font-weight: bold;
        background: #4c53ff;
        color: #fff;
        border-radius: 1rem;
      }
    </style>
  </head>
  <body>
    <div class="verify">
      <h1>GCMS 가입 인증 메일 번호</h1>
      <span>${verifyNum}</span>
    </div>
  </body>
</html>
`;
