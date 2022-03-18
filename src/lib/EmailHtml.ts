export const EmailHtml = (
  baseUrl: string,
  signupVerifyToken: string,
  frontUrl: string,
) => `<style>
  form {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  button {
    padding: 1rem 2rem;
    border: none;
    outline: none;
    border-radius: 1rem;
    background: #54a0ff;
    color: #fff;
    font-size: 1.5rem;
    font-family: inherit;
    font-weight: bold;
    cursor: pointer;
  }
</style>
<form class="verify-form" target="${frontUrl}">
  <h1>GCMS 가입 인증 메일</h1>
  <button type="submit">인증하기</button>
</form>
<script>
  document.querySelector('.verify-form').addEventListener('submit', (e) => {
    fetch('${baseUrl}/auth/verify?signupVerifyToken=${signupVerifyToken}', { method: 'HEAD' });
  });
</script>`;
