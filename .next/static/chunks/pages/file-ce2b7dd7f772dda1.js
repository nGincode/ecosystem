(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[130],{6829:function(e,a,t){(window.__NEXT_P=window.__NEXT_P||[]).push(["/file",function(){return t(934)}])},934:function(e,a,t){"use strict";t.r(a),t.d(a,{default:function(){return File}});var l=t(5893),n=t(7294),o=t(6501),i=t(5121),s=t(9335),r=t(6455),d=t.n(r),c=t(5675),m=t.n(c);function File(e){var a,t;let{userData:r,setuserData:c}=e,[h,u]=(0,n.useState)([]),[v,p]=(0,n.useState)(),[g,x]=(0,n.useState)([]),[f,w]=(0,n.useState)(!0),[j,y]=(0,n.useState)([]),N="Files";"undefined"!=typeof document&&(document.title=N);let handleApi=async function(e){let a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;if("create_user"===e)try{await (0,i.Z)({method:"POST",url:"/api/user",data:a,headers:{Authorization:"Bearer ".concat(localStorage.getItem("token"))}}).then(e=>{p(e.data.data),o.ZP.success(e.data.massage),$(".btn-close").trigger("click"),document.getElementById("formCreate").reset(),handleApi("view_user")})}catch(e){o.ZP.error(e.response.data.massage)}};(0,n.useEffect)(()=>{var e,a,t,l,n,s;let handleApiFirst=async function(e){if(arguments.length>1&&void 0!==arguments[1]&&arguments[1],"view_permission"===e)try{await (0,i.Z)({method:"GET",url:"/api/permission",headers:{Authorization:"Bearer ".concat(localStorage.getItem("token"))}}).then(e=>{x(e.data.data.map((e,a)=>({label:e.name,value:e.name})))})}catch(e){o.ZP.error(e.response.data.massage)}try{var a;await (0,i.Z)({method:"GET",url:"/api/file/"+(null===(a=JSON.parse(localStorage.getItem("companyActive")))||void 0===a?void 0:a.label),headers:{Authorization:"Bearer ".concat(localStorage.getItem("token"))}}).then(e=>{if(j.length>1){let a=[];j.map((t,l)=>{if(0==l){var n,o;a.push(null===(o=e.data.data)||void 0===o?void 0:null===(n=o[0])||void 0===n?void 0:n.children)}else a.push(t)}),y(a)}else{var a,t;y([null===(t=e.data.data)||void 0===t?void 0:null===(a=t[0])||void 0===a?void 0:a.children])}})}catch(e){o.ZP.error(e.response.data.massage)}};handleApiFirst("view_permission"),u(null!==(s=null==r?void 0:null===(n=r.permission)||void 0===n?void 0:null===(l=n.data)||void 0===l?void 0:null===(t=l.map(e=>e.data.find(e=>{if(e.label==N)return e})))||void 0===t?void 0:null===(a=t.filter(e=>void 0!==e))||void 0===a?void 0:null===(e=a[0])||void 0===e?void 0:e.checklist)&&void 0!==s?s:[])},[r,f]),console.log(j);let[k,b]=(0,n.useState)(0),[C,S]=(0,n.useState)([]),[B,A]=(0,n.useState)(),[F,P]=(0,n.useState)(),[_,I]=(0,n.useState)(""),[Z,E]=(0,n.useState)(!1),[L,O]=(0,n.useState)({x:0,y:0}),handleFolderClick=e=>{"folder"===e.type&&e.children&&(y(a=>[...a,e.children]),b(k+1),S(a=>[...a,e.name]))},handleSelectFile=e=>{A(e.id),P(e)},handleBackClick=()=>{C.pop(),S([...C]),P(j[k>0?k-1:0]),y(j.filter((e,a)=>a!==k)),b(k>0?k-1:0)},handleAction=async(e,a)=>{let t=null===(r=null!==(m=e.location)&&void 0!==m?m:null===(c=JSON.parse(localStorage.getItem("companyActive")))||void 0===c?void 0:c.label)||void 0===r?void 0:r.split("\\");t.splice(t.length-1,1);let l=t.join("\\");if("delete"==a)d().fire({icon:"info",title:"Delete !!!",text:"Are You sure want to delete ".concat(null!==(h=e.name)&&void 0!==h?h:""," ?"),showCancelButton:!0,confirmButtonColor:"#d33",cancelButtonColor:"#686868",confirmButtonText:"Delete"}).then(async a=>{if(a.isConfirmed)try{await (0,i.Z)({method:"POST",url:"/api/file",data:{type:"delete",location:e.location,locationBefore:l},headers:{Authorization:"Bearer ".concat(localStorage.getItem("token"))}}).then(a=>{o.ZP.success(a.data.massage);let t=[];j.map((l,n)=>{n==j.length-1?t.push([...a.data.data.filter(a=>a.location!==e.location)]):t.push(l)}),P(t.find(e=>e.location===l)),y(t),w(!f)})}catch(e){o.ZP.error(e.response.data.massage)}});else if("rename"==a);else if("upload"==a){var n,s,r,c,m,h,u,v,p=new FormData;for(let a=0;a<e.file.length;a++)p.append("files",e.file[a]);p.append("type",a),p.append("location",null!==(v=e.location)&&void 0!==v?v:null===(u=JSON.parse(localStorage.getItem("companyActive")))||void 0===u?void 0:u.label),p.append("locationBefore",l);try{await (0,i.Z)({method:"POST",url:"/api/file",data:p,headers:{Authorization:"Bearer ".concat(localStorage.getItem("token")),"Content-Type":"multipart/form-data"}}).then(e=>{o.ZP.success(e.data.massage);let a=[];j.map((t,l)=>{l==j.length-1?a.push([...e.data.data]):a.push(t)}),y(a),document.getElementById("upload").value="",w(!f)})}catch(e){o.ZP.error(e.response.data.massage)}}else if("create_folder"==a)try{await (0,i.Z)({method:"POST",url:"/api/file",data:{type:a,location:null!==(s=e.location)&&void 0!==s?s:null===(n=JSON.parse(localStorage.getItem("companyActive")))||void 0===n?void 0:n.label,name:e.nameFolder,locationBefore:l},headers:{Authorization:"Bearer ".concat(localStorage.getItem("token"))}}).then(e=>{o.ZP.success(e.data.massage);let a=[];j.map((t,l)=>{l==j.length-1?a.push([...e.data.data]):a.push(t)}),y(a),w(!f)})}catch(e){o.ZP.error(e.response.data.massage)}else window.location.href="/files/"+e.location},handleOutsideClick=e=>{e.target.closest(".custom-menu")||(E(!1),document.removeEventListener("click",handleOutsideClick))},handleContextMenu=(e,a)=>{handleSelectFile(a),e.preventDefault(),E(!0);let t=e.clientY-150,l=window.innerWidth;e.clientX,O({x:l>1024?e.clientX-360:e.clientX,y:t}),document.addEventListener("click",handleOutsideClick)};return(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)("div",{className:"col-12 mb-5",children:(0,l.jsx)("h1",{className:"hp-mb-0 text-4xl font-bold",id:"subject",children:N})}),(0,l.jsx)("div",{className:"row mb-32 gy-32",children:(0,l.jsx)("div",{className:"col-12",children:(0,l.jsx)("div",{className:"card hp-contact-card mb-32 -mt-3 shadow-md",children:(0,l.jsx)("div",{className:"card-body px-0",children:(0,l.jsxs)("div",{className:"file-manager-container",children:[(0,l.jsxs)("div",{className:"header",children:[(0,l.jsxs)("div",{className:"breadcumb",children:[(0,l.jsx)("span",{onClick:()=>{S([]),b(0)},children:null===(a=JSON.parse(localStorage.getItem("companyActive")))||void 0===a?void 0:a.label}),C.map((e,a)=>(0,l.jsxs)(n.Fragment,{children:[(0,l.jsx)("b",{children:"/"}),(0,l.jsx)("span",{onClick:()=>{let t=C.indexOf(e);t>-1&&C.splice(t+1),S([...C]),b(a+1)},children:e.toLowerCase()})]},e))]}),(0,l.jsxs)("div",{className:"search-container flex items-center gap-2 text-center",children:[(0,l.jsxs)(s.Popover,{placement:"bottom",animate:{mount:{scale:1,y:0},unmount:{scale:0,y:25}},children:[(0,l.jsx)(s.PopoverHandler,{children:(0,l.jsx)(s.Button,{className:"w-80 ",variant:"gradient",color:"cyan",children:" Create Folder"})}),(0,l.jsxs)(s.PopoverContent,{className:"w-96 p-3",children:[(0,l.jsx)(s.Typography,{variant:"small",color:"blue-gray",className:"mb-1 font-bold",children:"Name Folder"}),(0,l.jsxs)("div",{className:"flex gap-2",children:[(0,l.jsx)(s.Input,{id:"nameFolder",size:"lg",variant:"standard",placeholder:"name",className:" !border-t-blue-gray-200 focus:!border-t-gray-900 border-b-1",labelProps:{className:"before:content-none after:content-none"}}),(0,l.jsx)(s.Button,{onClick:()=>{var e;handleAction({...F,nameFolder:null===(e=document.getElementById("nameFolder"))||void 0===e?void 0:e.value},"create_folder"),document.getElementById("nameFolder").value=""},className:"w-32 h-10 mt-2 ",variant:"gradient",color:"cyan",children:"Create"})]})]})]}),(0,l.jsx)("input",{onChange:e=>handleAction({...F,file:e.target.files},"upload"),type:"file",multiple:!0,className:"hidden",name:"upload",id:"upload"}),(0,l.jsx)(s.Button,{className:"w-80 cursor-pointer",variant:"gradient",color:"cyan",children:(0,l.jsx)("label",{htmlFor:"upload",className:" cursor-pointer",children:"Upload File"})}),(0,l.jsx)("input",{type:"text",placeholder:"Search files...",onChange:e=>{I(e.target.value)},value:_})]})]}),(0,l.jsxs)("div",{className:"body",children:[(0,l.jsxs)("div",{className:"file-container-headers",children:[(0,l.jsx)("div",{children:"File"}),(0,l.jsx)("div",{children:"Size"}),(0,l.jsx)("div",{children:"Modified"})]}),k>0&&(0,l.jsx)("div",{className:"files-list",style:{marginBottom:"0px",height:"35px"},onClick:()=>handleBackClick(),children:(0,l.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor",className:"w-4 h-4",children:(0,l.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"})})}),Z&&(0,l.jsx)(e=>{let{handleMenuItemClick:a,menuPosition:t}=e,n=(null==F?void 0:F.type)=="file"?["Delete","Download"]:["Delete"],handleClick=e=>{a(e)};return(0,l.jsx)("div",{className:"custom-menu rounded shadow bg-white absolute  z-50",style:{left:t.x,top:t.y},children:n.map(e=>(0,l.jsxs)("div",{className:"cursor-pointer rounded px-4 py-2  hover:bg-gray-400 flex",onClick:()=>handleClick(e),children:["Delete"==e?(0,l.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor",className:"w-4 h-4 text-red-600 mr-2",children:(0,l.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"})}):"Rename"==e?(0,l.jsxs)("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor",className:"w-4 h-4 text-green-600  mr-2",children:[(0,l.jsx)("path",{d:"M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z"}),(0,l.jsx)("path",{d:"M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z"})]}):(0,l.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor",className:"w-4 h-4 text-blue-600 mr-2",children:(0,l.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"})})," ",e]},e))})},{handleMenuItemClick:(e,a)=>{switch(e){case"Delete":handleAction(F,"delete");break;case"Rename":handleAction(F,"rename");break;default:handleAction(F,"Download")}E(!1)},menuPosition:L}),null===(t=j[k])||void 0===t?void 0:t.filter(e=>e.name.toLowerCase().includes(_.toLowerCase())).map(e=>{var a;return(0,l.jsxs)("div",{className:"files-list ".concat(e.id===B?"active":""),onClick:()=>handleSelectFile(e),onDoubleClick:()=>handleFolderClick(e),onContextMenu:a=>handleContextMenu(a,e),children:[(0,l.jsxs)("div",{className:"file-container",children:[(0,l.jsx)("div",{className:"".concat(e.type)}),(0,l.jsx)("div",{className:"filename",style:{pointerEvents:"none"},children:e.name})]}),(0,l.jsx)("div",{className:"size",children:e.meta.size}),(0,l.jsx)("div",{className:"date",children:e.meta.modified})]},null!==(a=e.id+e.name)&&void 0!==a?a:"0000")}),j.length&&(null==j?void 0:j[0].length)?null:(0,l.jsxs)("div",{className:"text-center w-full text-gray-500",children:[(0,l.jsxs)("div",{className:"flex justify-center mt-1 -mb-7 ",children:[(0,l.jsx)(m(),{src:"/img/noResult.gif",width:200,height:200,alt:"noResult"})," "]}),(0,l.jsx)("div",{className:"text-lg",children:"No results found"})]})]})]})})})})})]})}}},function(e){e.O(0,[774,888,179],function(){return e(e.s=6829)}),_N_E=e.O()}]);