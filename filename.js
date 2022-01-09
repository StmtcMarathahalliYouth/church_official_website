// This fucntion to check that a valid email is entered
// if valid redirect to the page with OTP
function emailcheck(email) {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },

    body: JSON.stringify({
      'email': email
    })
  };
  getData('https://api.stmtcmarathahalli.com:8080/user/otp', requestOptions)
    .then(
      (response) => {
        if (response.status == 200) {
          document.getElementById('member-login').innerHTML = ` 
          <div class="container">
            <div class="row text-center">
                <h5>Member Login</h5>
            </div>
            <div class="row text-center" id = "login-failed">
                                  
            </div>
            <div class="row">
              <input type="text" disabled=true placeholder="Enter email" id="insertedEmail" name="uname" value=` + email + `>
            </div>
            <div class="row">
              <input type="text" placeholder="Enter OTP" id="insertedOtp" name="uname">
            </div>
            <div class="row">
              <button type="submit" onclick="otpcheck(insertedEmail.value, insertedOtp.value)" id="login-button">Login</button>
            </div>
          </div>`
        }
        else {
          document.getElementById('login-failed').innerHTML = `<label font-size=small>This email is not registered.</label>`
        }
      }
    )
  // First set text value to 0 and then change placeholder.
  // In case we need to store value of email we may need to add above line 7

}

// This fuction to check the OTP string is not empty
// Further checks as needed
function otpcheck(email, otp) {
  console.log("Reached OTP Check")
  document.getElementById('login-button').disabled = true;
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'email': email,
      'otp': new Number(otp)
    })
  };
  getLoginData('https://api.stmtcmarathahalli.com:8080/user/login', requestOptions)
    .then(
      (result) => {
        setCookie("isLoggedIn", true, 14);
        setCookie("authToken", result.token, 14);
        setCookie("userId", result.userId, 14);
        window.open('https://harvest.stmtcmarathahalli.com', '_blank').focus();

      }
    )
  document.getElementById("login-button").disabled = false;

}

async function getLoginData(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, data);
  if (response.status === 200 || response.status === 202) {
    return response.json(); // parses JSON response into native JavaScript objects
  } else if (response.status === 401) {
    const result = response.json();
    document.cookie = "isLoggedIn" + '=; Max-Age=-99999999;';
    document.cookie = "authToken" + '=; Max-Age=-99999999;';
    document.cookie = "userId" + '=; Max-Age=-99999999;';
    document.getElementById('login-failed').innerHTML = `<label font-size=small>Invalid OTP</label>`
  }
}

function checkLogin() {
  console.log("Checking");
  getCookie("isLoggedIn").then(
    (loginStatus) => {
      console.log(loginStatus);
      if (loginStatus == 'true') {
        console.log("Here!")
        document.getElementById('member-login').innerHTML = ` 
          <div>
            Go to <a href="https://harvest.stmtcmarathahalli.com">Harvest Festival Page</a>
          </div>
        `
      }
    })
}

async function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return Promise.resolve(c.substring(name.length, c.length));
    }
  }
  return Promise.resolve(false);
}

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires=" + d.toUTCString();
  let domain = "domain=stmtcmarathahalli.com"
  let cookieValue = cname + "=" + cvalue + ";" + expires + ";" + domain;
  document.cookie = cookieValue;
}

async function getData(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, data);
  return response;
}