export const EmailHtml = (url: string) => `<!DOCTYPE html>
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
      .verify a {
        padding: 1rem 2rem;
        border-radius: 1rem;
        text-decoration: none;
        background: #54a0ff;
        color: #fff;
        font-size: 1.5rem;
        font-family: inherit;
        font-weight: bold;
        cursor: pointer;
        transition: 0.2s;
      }
      .verify a:hover {
        background: #2e87f3;
      }
    </style>
  </head>
  <body>
    <div class="verify">
      <h1>GCMS 가입 인증 메일</h1>
      <a href="${url}">인증하기</a>
    </div>
  </body>
</html>
`;
