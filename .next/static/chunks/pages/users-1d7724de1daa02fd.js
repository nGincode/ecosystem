(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[892],{3947:function(e,a,s){(window.__NEXT_P=window.__NEXT_P||[]).push(["/users",function(){return s(2808)}])},2808:function(e,a,s){"use strict";s.r(a),s.d(a,{default:function(){return m}});var d=s(5893),l=s(7294),r=s(6501),t=s(7066),i=s(9335),n=s(3438),c=s(4254),o=s(2330);function m(e){let{userData:a,setuserData:s}=e,[m,u]=(0,l.useState)([]),[v,h]=(0,l.useState)(),[p,x]=(0,l.useState)(""),[b,N]=(0,l.useState)([]),f="/api/user",j="Users";"undefined"!=typeof document&&(document.title=j);let g=async function(e){let a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;if("create_user"===e)try{await (0,t.Z)({method:"POST",url:"/api/user",data:a,headers:{Authorization:"Bearer ".concat(localStorage.getItem("token"))}}).then(e=>{h(e.data.data),r.ZP.success(e.data.massage),$(".btn-close").trigger("click"),document.getElementById("formCreate").reset(),g("view_user")})}catch(e){r.ZP.error(e.response.data.massage)}};return(0,l.useEffect)(()=>{var e,s,d,l,i,n;(async function(e){if(arguments.length>1&&void 0!==arguments[1]&&arguments[1],"view_permission"===e)try{await (0,t.Z)({method:"GET",url:"/api/permission",headers:{Authorization:"Bearer ".concat(localStorage.getItem("token"))}}).then(e=>{N(e.data.data.map((e,a)=>({label:e.name,value:e.name})))})}catch(e){r.ZP.error(e.response.data.massage)}})("view_permission"),u(null!==(n=null==a?void 0:null===(i=a.permission)||void 0===i?void 0:null===(l=i.data)||void 0===l?void 0:null===(d=l.map(e=>e.data.find(e=>{if(e.label==j)return e})))||void 0===d?void 0:null===(s=d.filter(e=>void 0!==e))||void 0===s?void 0:null===(e=s[0])||void 0===e?void 0:e.checklist)&&void 0!==n?n:[])},[a]),(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)("div",{className:"col-12 mb-5",children:(0,d.jsx)("h1",{className:"hp-mb-0 text-4xl font-bold",children:j})}),(0,d.jsxs)("div",{className:"row mb-32 gy-32",children:[(0,d.jsx)("div",{className:"col-12 mt-10",children:(0,d.jsxs)("div",{className:"row g-16 align-items-center justify-content-end",children:[(0,d.jsx)("div",{className:"col-12 col-md-6 col-xl-4",children:(0,d.jsx)("div",{className:"input-group align-items-center",children:(0,d.jsx)(o.Z,{value:null!=p?p:"",onChange:e=>x(String(e)),className:"form-control ps-8",placeholder:"Search all columns..."})})}),m.find(e=>"create"==e)?(0,d.jsx)("div",{className:"col hp-flex-none w-auto",children:(0,d.jsxs)(i.Button,{type:"button",className:"w-100 px-5",variant:"gradient",color:"cyan","data-bs-toggle":"modal","data-bs-target":"#addNewUser",children:[(0,d.jsx)("i",{className:"ri-add-line remix-icon"})," Add Users"]})}):null,(0,d.jsx)("div",{className:"modal fade -mt-2",id:"addNewUser",tabIndex:-1,"aria-labelledby":"addNewUserLabel","aria-hidden":"true","data-bs-keyboard":"false","data-bs-backdrop":"static",children:(0,d.jsx)("div",{className:"modal-dialog modal-dialog-centered",children:(0,d.jsxs)("div",{className:"modal-content",children:[(0,d.jsxs)("div",{className:"modal-header py-16 px-24",children:[(0,d.jsx)("h5",{className:"modal-title font-bold",id:"addNewUserLabel",children:"Add Users"}),(0,d.jsx)("button",{type:"button",className:"btn-close hp-bg-none d-flex align-items-center justify-content-center","data-bs-dismiss":"modal","aria-label":"Close",children:(0,d.jsx)("i",{className:"ri-close-line hp-text-color-dark-0 lh-1",style:{fontSize:"24px"}})})]}),(0,d.jsx)("div",{className:"divider m-0"}),b.length?(0,d.jsxs)("form",{onSubmit:e=>{if(e.preventDefault(),e.target.password.value!==e.target.confirm_password.value){r.ZP.error("Password not match");return}if(e.target.password.value<8||e.target.confirm_password.value<8){r.ZP.error("Password min 8 char");return}g("create_user",{username:e.target.username.value,email:e.target.email.value,fullName:e.target.fullName.value,phone:e.target.phone.value,address:e.target.address.value,dateOfBirth:e.target.dateOfBirth.value,role:e.target.role_val.value,password:e.target.password.value,confirm_password:e.target.confirm_password.value})},id:"formCreate",children:[(0,d.jsx)("div",{className:"modal-body",children:(0,d.jsxs)("div",{className:"row gx-8",children:[(0,d.jsx)("div",{className:"col-12 col-md-6",children:(0,d.jsx)("div",{className:"mb-24",children:(0,d.jsx)(i.Input,{type:"text",required:!0,variant:"standard",className:"border-b-1",name:"fullName",label:"Full Name",id:"name"})})}),(0,d.jsx)("div",{className:"col-12 col-md-6",children:(0,d.jsx)("div",{className:"mb-24",children:(0,d.jsx)(i.Input,{type:"text",required:!0,variant:"standard",className:"border-b-1",name:"username",label:"Username",id:"username"})})}),(0,d.jsx)("div",{className:"col-12 col-md-6",children:(0,d.jsx)("div",{className:"mb-24",children:(0,d.jsx)(i.Input,{type:"email",required:!0,variant:"standard",className:"border-b-1",name:"email",label:"Email",id:"email"})})}),(0,d.jsx)("div",{className:"col-12 col-md-6",children:(0,d.jsx)("div",{className:"mb-24",children:(0,d.jsx)(i.Input,{type:"text",required:!0,variant:"standard",className:"border-b-1",name:"phone",label:"Phone",id:"nophone"})})}),(0,d.jsx)("div",{className:"col-12 col-md-6",children:(0,d.jsx)("div",{className:"mb-24",children:(0,d.jsx)(i.Input,{type:"date",required:!0,variant:"standard",className:"border-b-1",name:"dateOfBirth",label:"Date Of Birth",id:"dateOfBirth"})})}),(0,d.jsx)("div",{className:"col-12 col-md-6",children:(0,d.jsx)("div",{className:"mb-24",children:(0,d.jsx)(n.Z,{variant:"standard",required:!0,label:"Role",name:"role",id:"role",data:b})})}),(0,d.jsx)("div",{className:"col-12",children:(0,d.jsx)("div",{className:"mb-24",children:(0,d.jsx)(i.Textarea,{required:!0,variant:"standard",className:"border-b-1",id:"address",label:"Address",name:"address"})})}),(0,d.jsx)("div",{className:"col-12 col-md-6",children:(0,d.jsx)("div",{className:"mb-24",children:(0,d.jsx)(i.Input,{required:!0,type:"password",autoComplete:"",variant:"standard",className:"border-b-1",name:"password",label:"Password",id:"password"})})}),(0,d.jsx)("div",{className:"col-12 col-md-6",children:(0,d.jsx)("div",{className:"mb-24",children:(0,d.jsx)(i.Input,{required:!0,type:"password",autoComplete:"",variant:"standard",className:"border-b-1",name:"confirm_password",label:"Confirm Password",id:"confirm_password"})})})]})}),(0,d.jsxs)("div",{className:"modal-footer pt-0 px-24 pb-24",children:[(0,d.jsx)("div",{className:"divider"}),(0,d.jsx)(i.Button,{type:"submit",className:"w-full",color:"blue",children:"Submit"})]})]}):(0,d.jsx)("div",{className:"text-center font-semibold my-3",children:"Make permission first"})]})})})]})}),(0,d.jsx)("div",{className:"col-12",children:(0,d.jsx)("div",{className:"card hp-contact-card mb-32 -mt-3 shadow-md",children:(0,d.jsx)("div",{className:"card-body px-0",children:(0,d.jsx)(c.Z,{search:p,action:{delete:m.find(e=>"delete"==e)?f:null,edit:m.find(e=>"edit"==e)?f:null},urlFatch:f,reload:v,modalData:[{name:"fullName",type:"text",id:"fullName",required:!0},{name:"username",type:"text",id:"usernameEdit",required:!0},{name:"email",type:"email",id:"emailEdit",required:!0},{name:"phone",type:"text",id:"nophoneEdit",required:!0},{name:"dateOfBirth",type:"date",id:"dateOfBirthEdit",required:!0},{name:"role",type:"reactSelect",id:"roleEdit",select:b,required:!0},{name:"status",type:"reactSelect",id:"statusEdit",select:[{value:"active",label:"Active"},{value:"inactive",label:"Inactive"},{value:"pending",label:"Pending"}],required:!0},{name:"address",type:"textarea",id:"addressEdit",required:!0,full:!0}]})})})})]})]})}}},function(e){e.O(0,[77,298,269,888,774,179],function(){return e(e.s=3947)}),_N_E=e.O()}]);