// major experimet jo ki sirf isi kek andar hoga so code workk nana kre so is part ko hatanaa////////////////////////////////

document.addEventListener("click", (e) => {

  // LIKE
  if (e.target.closest("[data-like-btn]")) likebtn(e);

  // COMMENT SEND
  if (e.target.closest("[data-send-btn]")) cmtSend(e);

  // COMMENT BUTTON
  if (e.target.closest(".cmt-btn")) cmtBtn(e);

  // POST MENU
  if (e.target.closest("i[vertical-option-bar]")) postMenuBtn(e);

  // EDIT POST
  if (e.target.closest("[data-edit]")) editPostBtn(e);

  // DELETE POST
  if (e.target.closest("[data-delete]")) deletePostBtn(e);

  // DRAFT MENU
  if (e.target.closest("i[vertical-option-barrr]")) draftMenu(e);

  // DRAFT DELETE
  if (e.target.closest("[data-draft-delete]")) deleteDraftBtn(e);

  // UPDATE POST
  // if (e.target.closest("[data-update-btn]")) updatePost(e);

});
































































/////////////////////////////////////////////////////////////////////////////////////////////////////////














document.querySelectorAll("a[data-page]").forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const page = e.currentTarget.getAttribute("data-page");
    loadPage(page);
  });
});








document.addEventListener("DOMContentLoaded" , () => {
  loadPage("feed");
});


function loadPage(page) {
  fetch(`/components/${page}`)
    .then(res => res.text())
    .then(html => {
      document.getElementById("content").innerHTML = html;
      initPage(page);
    });
}

   

function initPage(page) {
  if (page === "feed") {
    // initFeedPage();
    // initCommnetSec();
    //  likebtn();
    // cmtBtn();
    // postMenuBtn();
  } else if (page === "write") {
    initNotesPage();
  } else if (page === "profile") {
    loadProfilePage("post");
    initEditPage();
  } else if (page === "drafts") {
    // draftMenu()
  } else if (page === ""){
    initFeedPage();
  }
}



function initEditPage(){
  const editbtn = document.querySelector(".editbtn")
  editbtn.addEventListener('click', () => {
    loadPage("edit")
  })


  document.addEventListener("click", (e) => {
  if (e.target.classList.contains("profile-tab")) {

    document.querySelectorAll(".profile-tab").forEach(btn => {
      btn.classList.remove("bg-gray-300");
      btn.classList.add("bg-gray-100");
    });

    e.target.classList.add("bg-gray-300");

    const tab = e.target.dataset.tab;

    document.querySelectorAll(".tab-content").forEach(c => {
      c.classList.add("hidden");
    });

    document.getElementById(tab).classList.remove("hidden");

    if(tab ==="personal"){
      initEditDataSender();
    }
  }
});
}



function initEditDataSender(){
  const btn1 = document.querySelector('#personalInfo')
  btn1.addEventListener('click', async() => {
    let userInfo = {};
    let valid = true;
     document.querySelectorAll(".input").forEach(i => {
      if(i.value === ""){
         valid = false;
      }
      let name = i.name;
      let value = i.value;
      userInfo[name] = value;
    });

    if(!valid) return alert('form bhado pehle');

    console.log(userInfo);
    const res = await fetch("/edit/personal",{
      method: "PATCH",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({userInfo})
    })

    window.location.href = "/Dashboard";
  })

}



function initNotesPage() {
  const publishBtn = document.getElementById("publishbtn");
  const draftBtn = document.getElementById("draftbtn");
  const myform = document.getElementById("myForm");

  if (!publishBtn || !myform) return;

  publishBtn.addEventListener("click", async () => {
    console.log('helllo from publish btn');
    let validity = myform.checkValidity();
    if (!validity) {
      myform.reportValidity();
      return;
    }

    let form = new FormData(myform);
    const { title, story } = Object.fromEntries(form.entries());

    await fetch("/new", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, story })
    });

    window.location.href = "/Dashboard";
  });

  

  draftBtn?.addEventListener("click", async () => {
    console.log('helllo draft btnnn');
    let validity = myform.checkValidity();
    if (!validity) {
      myform.reportValidity();
      return;
    }

    let form = new FormData(myform);
    const { title, story } = Object.fromEntries(form.entries());

    await fetch("/drafts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, story })
    });

    window.location.href = "/Dashboard";
  });
}


//-------------- comment secion logic----------------------------------------------------------------------


  
document.addEventListener("click", async(e) => {
 const btn = e.target.closest("button[data-type]");
if (!btn) return;

const page = btn.dataset.type;
const postID = btn.dataset.postid;
const userID = btn.dataset.userid;

console.log(postID);

const res = await fetch(`/Dashboard/${page}`,{
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        postID:postID,
        userID:userID,
        page:page
      })
    })

    const data = await res.text();
    document.getElementById("cdisplay").innerHTML = data;
})



//----------------------------------------------------------------------------------------------------------------



function loadProfilePage(page) {
  fetch(`/profile/${page}`)
    .then(res => res.text())
    .then(html => {
      document.getElementById("profile-content").innerHTML = html;
    });
}



document.addEventListener("click", (e) => {
  if (!e.target.matches("a[data-profile]")) return;
  e.preventDefault();

  
  const page = e.target.dataset.profile;
  loadProfilePage(page);

  document.querySelectorAll('#profile-box a')
    .forEach(a => a.classList.remove("border-b-2", "border-indigo-600", "text-indigo-600"));

  e.target.classList.add("border-b-2", "border-indigo-600", "text-indigo-600");
});


//------------------------ likes & commnet mechnaismssnwfjd,-----------------------------


function likebtn(e) {
    const btn = e.target.closest("[data-like-btn]");
    if (!btn) return;

    btn.disabled = true;
    setTimeout(() => btn.disabled = false, 500);

    const postID = btn.dataset.postid;
    const userID = btn.dataset.userid;

    const icon = btn.querySelector("[data-like-icon]");
    const countSpan = btn.querySelector("[data-like-count]");

    fetch("/likes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postID, userID })
    })
    .then(res => res.json())
    .then(data => {
      if (data.isliked) {
        icon.classList.add("text-red-500", "fa-solid");
        icon.classList.remove("fa-regular");
      } else {
        icon.classList.remove("text-red-500", "fa-solid");
        icon.classList.add("fa-regular");
      }

      countSpan.innerText = data.data;
    });
}



// function likebtn() {
// // if (likeListenerAttached) return; 
// //   likeListenerAttached = true;
//   document.addEventListener('click', async (e) => {
//     const btn = e.target.closest("[data-like-btn]");
//     if (!btn) return;

//     btn.disabled = true;
//     setTimeout(() => btn.disabled = false, 500);

//     const postID = btn.dataset.postid;
//     const userID = btn.dataset.userid;

//     const icon = btn.querySelector("[data-like-icon]");
//     const countSpan = btn.querySelector("[data-like-count]");


//     const res = await fetch("/likes", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ postID, userID })
//     });

//     const data = await res.json();
//     console.log("data", data);

//     if (icon) {
//       if (data.isliked === true) {
//         icon.classList.add("text-red-500");
//         icon.classList.remove("fa-regular");
//         icon.classList.add("fa-solid");
//       } else {
//         icon.classList.remove("text-red-500");
//         icon.classList.remove("fa-solid");
//         icon.classList.add("fa-regular");
//       }
//     }


//     if (countSpan) {
//       countSpan.innerText = data.data;
//     }
//   });
// }

//------------------------------------------- comments--------------------------------------------------------

let curr_post_id = null;
let curr_user_id = null;


function cmtBtn(e) {
  const btn = e.target.closest(".cmt-btn");
  if (!btn) return;

  curr_post_id = btn.dataset.postid;
  curr_user_id = btn.dataset.userid;
}

function cmtSend(e) {
  const sendBtn = e.target.closest("[data-send-btn]");
  if (!sendBtn) return;

  const wrapper = sendBtn.closest("#c-input");
  const input = wrapper.querySelector("[data-cmt-input]");
  const value = input.value.trim();
  if (value === "") return;

  input.value = "";

  axios.post("/comments", {
    postID: curr_post_id,
    userID: curr_user_id,
    comment: value
  }).then(res => {
    if (res.status === 200) window.location.href = "/Dashboard";
  });
}



// function cmtBtn() {
//   // if(cmtListenerAttached) return;
//   //  cmtListenerAttached = true;
//   document.addEventListener("click", async(e) => {

//     if (e.target.closest(".cmt-btn")) {
//       const btn = e.target.closest(".cmt-btn");

//       curr_post_id = btn.dataset.postid;
//       curr_user_id = btn.dataset.userid;

//       console.log("COMMENT BTN CLICK:", { curr_post_id, curr_user_id });

//     }


//     if (e.target.closest("[data-send-btn]")) {
//       const sendBtn = e.target.closest("[data-send-btn]");
//       const wrapper = sendBtn.closest("#c-input");
//       const input = wrapper.querySelector("[data-cmt-input]");

//       const value = input.value.trim();

//       console.log("INPUT VALUE:", value);

//       if (value === "") return console.log("Empty comment");

//       input.value = "";

//        const res = await axios.post("/comments",{
//               postID:curr_post_id,
//               userID:curr_user_id,
//               comment:value
//             })

        
//          if(res.status === 200){
//       window.location.href = "/Dashboard"
//     }
        
//     }

//   })
// }









//-----------------------------------------------------------------------------------------------



function postMenuBtn(e){
  // if(postMenuAttached) return;
  // postMenuAttached = true;
 console.log("MENU ACTIVE");
  //  document.addEventListener("click", async(e) => {

  const menuBtn = e.target.closest("i[vertical-option-bar]");
  if (!menuBtn)  return;

  const container = menuBtn.closest(".posts");
  const currentMenu = container.querySelector("[data-menu-box]");
  if (!currentMenu.classList.contains("hidden")) {
      currentMenu.classList.add("hidden");
    return;
  }

  const allMenus = document.querySelectorAll("[data-menu-box]");
  allMenus.forEach(menu => menu.classList.add("hidden"));


  currentMenu.classList.remove("hidden");

  return;
  // }


  // if (e.target.closest("[data-edit]")) {
  //   console.log("User edittttt krna chaaaahhh rha hai");
  //   const editBtn = e.target.closest("[data-edit]");
  //   const postID  = editBtn.dataset.postid;
  //   console.log(postID)
  //   loadPage("postEdit");
  //   updatePost(postID);
  // }

  // if (e.target.closest("[data-delete]")) {
  //   const btn = e.target.closest("[data-delete]");
  //   const postID = btn.dataset.postid;
  //   const userID = btn.dataset.userid;
  //   console.log("postid userid:",postID,userID)

  //   const res = await axios.delete("/delete",{
  //             data:{postID,userID}
  //           })

  //   if(res.status === 200){
  //     window.location.href = "/Dashboard"
  //   }

    
  // }

// });

}

async function editPostBtn(e) {
    const editBtn = e.target.closest("[data-edit]");
    if(!editBtn) return;

    console.log("User edittttt krna chaaaahhh rha hai");
    const postID  = editBtn.dataset.postid;
    console.log(postID)
    loadPage("postEdit");
    updatePost(postID);
}

async function deletePostBtn(e){
  const btn = e.target.closest("[data-delete]");
  if(!btn) return;

    const postID = btn.dataset.postid;
    const userID = btn.dataset.userid;
    console.log("postid userid:",postID,userID)

    const res = await axios.delete("/delete",{
              data:{postID,userID}
            })

    if(res.status === 200){
      window.location.href = "/Dashboard"
    }
}


//----------------------------------------------------------------------------------------------------------------------------------------------------------------


 async function updatePost(id){
  document.addEventListener("click",async(e) => {
    if(!e.target.closest("[data-update-btn]")) return
    const btn = e.target.closest("[data-update-btn]");
    const title = document.querySelector("#editTitle").value;
    const content = document.querySelector("#editContent").value;

    console.log("btn cliked to update and post id haii ye",{
      id,
      title,
      content,
    });

    const res = await axios.patch("/editpost",{
      postID:id,
      title:title,
      content:content
    })
    if(res.status === 200){
      window.location.href = "/Dashboard"
    }

    if(res.status === 404){
      alert("404 post not found")
    }
  })
}


async function draftMenu(e){
  // document.addEventListener("click",async(e) => {
  const menuBtn = e.target.closest("i[vertical-option-barrr]");
  if (!menuBtn) return;
   console.log("draft menu clciked");
  const container = menuBtn.closest(".postsss");
  const currentMenu = container.querySelector("[data-menu-boxxx]");
  console.log(container);
  console.log(currentMenu);
  if (!currentMenu.classList.contains("hidden")) {
      currentMenu.classList.add("hidden");
  return;
  }
  const allMenus = document.querySelectorAll("[data-menu-boxxx]");
  allMenus.forEach(menu => menu.classList.add("hidden"));
  currentMenu.classList.remove("hidden");

  return;
  // }


  //  if (e.target.closest("[data-draft-delete]")) {
  //   const btn = e.target.closest("[data-draft-delete]");
  //   const postID = btn.dataset.postid;
  //   const userID = btn.dataset.userid;
  //   console.log("postid userid:",postID,userID)

  //   const res = await axios.delete("/deleteDrafts",{
  //             data:{postID,userID}
  //           })

  //   if(res.status === 200){
  //     loadPage("drafts")
  //   }

  //   console.log("delete btn clicked");
    
  // }
  // })
}

async function deleteDraftBtn(e){
  const btn = e.target.closest("[data-draft-delete]");
  if(!btn) return;

    const postID = btn.dataset.postid;
    const userID = btn.dataset.userid;
    console.log("postid userid:",postID,userID)

    const res = await axios.delete("/deleteDrafts",{
              data:{postID,userID}
            })

    if(res.status === 200){
      loadPage("drafts")
    }

    console.log("delete btn clicked");
}
