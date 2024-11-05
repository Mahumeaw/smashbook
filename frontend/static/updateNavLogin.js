function updateNavBar(isLoggedIn) {
    if (isLoggedIn) 
    {
        document.getElementById('loginUser').style.display = 'flex';
        document.getElementById('loginCourt').style.display = 'flex';
        document.getElementById('loginLogin').style.display = 'none';
        document.getElementById('loginLogout').style.display = 'flex';
        document.getElementById('loginSearch').style.display = 'none';
    } 
}

function getCookieNameAndValue(cookieName) {
    const name = cookieName + "=";
    //const name = cookieName;
    console.log(name);
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    console.log("docodedCookie: " + decodedCookie);
    console.log("cookieArray: "+ cookieArray);
    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i].trim();
        if (cookie.startsWith(name)) {
            return { name: cookieName, value: cookie.substring(name.length) };
        }
    }
    return null;
}

function doLogout(){
    document.cookie = "token" + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
    console.log("Logout "+ document.cookie);
    location.reload();
}

const tokenCookie = getCookieNameAndValue('token');
if (tokenCookie) {
    //console.log(`Cookie name: ${tokenCookie.name}, Cookie value: ${tokenCookie.value}`);
    updateNavBar(true);
} else {
    console.log('Cookie named "token" not found');
}

function getCookieNameAndValue(cookieName) {
    const name = cookieName + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    for (let i = 0; i < cookieArray.length; i++) 
        {
        let cookie = cookieArray[i].trim();
        if (cookie.startsWith(name)) {
            return { name: cookieName, value: cookie.substring(name.length) };
        }
    }
    return null;
}
