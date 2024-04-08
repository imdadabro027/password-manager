const formElement = document.getElementById("form");
const errorsElement = document.getElementById("errors");
const tableElement = document.getElementsByTagName("tbody")[0];

formElement.addEventListener("submit", async function (e) {
  e.preventDefault();

  const formData = new FormData(e.currentTarget);
  const { website, username, password } = Object.fromEntries(formData);

  if (!website || !username || !password) {
    errorsElement.innerHTML = "Fill all the fields correctly!";

    setTimeout(() => {
      errorsElement.innerHTML = "";
    }, 3000);
    return;
  }

  const previousPasswords = await getPreviousPasswords();
  const newPassword = { username, password, website };

  localStorage.setItem(
    "passwords",
    JSON.stringify([...previousPasswords, newPassword])
  );
  await showPasswords();
});

function getPreviousPasswords() {
  return JSON.parse(localStorage.getItem("passwords"), null, 2) || [];
}

async function showPasswords() {
  const previousPasswords = await getPreviousPasswords();
  tableElement.innerHTML = previousPasswords
    .map(
      (password, idx) =>
        `<tr onclick="copyPassword(${idx})"><td>${password.website}</td><td>${
          password.username
        }</td><td>${generatePassword(password.password.length)}</td></tr>`
    )
    .join("");
}

showPasswords();

function generatePassword(length) {
  let str = "";
  for (let i = 0; i < length; i++) {
    str += "*";
  }

  return str;
}

async function copyPassword(password) {
  const previousPasswords = await getPreviousPasswords();
  navigator.clipboard.writeText(previousPasswords[password].password);
}
