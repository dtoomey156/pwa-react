// const BORDERWRAPPER = document.querySelector(".border-wrapper");
const DRAWER = document.querySelector(".drawer");
const DRAWERCARD = document.querySelectorAll(".drawer-image, .drawer-title");
const DRAWERTITLE = document.querySelectorAll(".drawer-title");
const DIVIDERBAR = document.querySelectorAll(".divider-bar");


// let pointerStyleSheet = document.styleSheets[1].cssRules[0].style;


DRAWER.addEventListener("mousedown", addTransitions);
DRAWER.addEventListener("mouseleave", removeTransitions);
DRAWERCARD.forEach(elem => {
    elem.addEventListener("mousedown", clickReaction);
})

function addTransitions() {
    
    DRAWER.className += " extendo";
    DRAWER.style.borderRightColor = "#0d6efd50";
    DRAWERTITLE.forEach(elem => {
        elem.classList.add("show-drawer-title");
    });
    DIVIDERBAR.forEach(elem => {
        elem.classList.add("divider-bar-fill");
    });
    clickReaction();
    
}

function clickReaction() {
    DRAWERCARD.forEach(elem => {
        elem.classList.add("mouse-pointer");
        elem.classList.add("drawer-card-clickable");
    });
}

LOGOUTBTN.addEventListener("click", () => {

})


// function addTransitions(e) {
//     console.log(e.type, e);
//     if (e.target.id == "") {
//         console.log("bird feeder");
//         DRAWER.className += " extendo";
//         DRAWER.style.borderRightColor = "#0d6efd50";
//         DRAWERCARD.forEach(elem => {
//             elem.classList.add("mouse-pointer");
//         });
//         DRAWERTITLE.forEach(elem => {
//             elem.classList.add("show-drawer-title");
//         });
//         DIVIDERBAR.forEach(elem => {
//             elem.classList.add("divider-bar-fill");
//         });

//     } else if (e.target.id == "signup" && e.type == "mouseover") {
//         const signup = document.querySelector("#signup");
//         signup.classList.add("hover-effect");
//     }
//     e.stopPropagation();
// }



function removeTransitions() {
    DRAWER.classList.remove("extendo");
    DRAWER.style.borderRightColor = "antiquewhite";
    DRAWERCARD.forEach(elem => {
        elem.classList.remove("mouse-pointer");
        elem.classList.remove("drawer-card-clickable");
    });
    DRAWERTITLE.forEach(elem => {
        elem.classList.remove("show-drawer-title");
    });
    DIVIDERBAR.forEach(elem => {
        elem.classList.remove("divider-bar-fill");
    });
   
};



// const INJECTCSS = (css) => {
//     let style = document.createElement('style');
//     // elem.type = "text/css";
//     style.innerText = css;
//     document.head.appendChild(style);
//     // return style;
// }

// INJECTCSS("body {background-color: #000}");