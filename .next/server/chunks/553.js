"use strict";exports.id=553,exports.ids=[553],exports.modules={1323:(e,s)=>{Object.defineProperty(s,"l",{enumerable:!0,get:function(){return function e(s,a){return a in s?s[a]:"then"in s&&"function"==typeof s.then?s.then(s=>e(s,a)):"function"==typeof s&&"default"===a?s:void 0}}})},4712:(e,s,a)=>{a.d(s,{Z:()=>n});var l=a(997),t=a(4715),r=a(6689);function n({id:e,color:s,name:a,checked:n}){let[i,d]=(0,r.useState)(null);return(0,l.jsxs)(l.Fragment,{children:[l.jsx(t.Checkbox,{color:s,id:e,checked:null===i?n:i,onChange:e=>{d(e.target.checked)}}),l.jsx("input",{type:"hidden",name:a,value:null===i?n:i})]})}},2330:(e,s,a)=>{a.d(s,{Z:()=>n});var l=a(997),t=a(6689),r=a(4715);function n({value:e,onChange:s,debounce:a=500,placeholder:n}){let[i,d]=(0,t.useState)(e);return l.jsx(r.Input,{label:n,className:"border-b-1",variant:"standard",value:i,onChange:e=>d(e.target.value)})}},9256:(e,s,a)=>{a.a(e,async(e,l)=>{try{a.d(s,{Z:()=>N});var t=a(997),r=a(6689),n=a(9648),i=a(6201),d=a(271),o=a.n(d),c=a(2245),m=a.n(c),h=a(4715),x=a(8032),u=a.n(x),g=a(281),j=a(4712),p=a(6869),v=a(539),f=a(5675),b=a.n(f),w=e([n,i,g,p,v]);[n,i,g,p,v]=w.then?(await w)():w,n.default.defaults.headers.common["X-Requested-With"]="XMLHttpRequest";let C=(e,s,a,l)=>{let t=(0,v.rankItem)(e.getValue(s),a);return l({itemRank:t}),t.passed},M=e=>{if(!e)return"";{let s=e.replace(/([A-Z])/g," $1");return s.charAt(0).toUpperCase()+s.slice(1)}};function N({search:e,action:s,modalData:a,dataFatch:l,urlFatch:d,Subject:c,reload:x,date:v}){let[f,w]=(0,r.useState)(),[N,y]=(0,r.useState)(),[P,S]=(0,r.useState)([]),[L,V]=(0,r.useState)(),[J,F]=(0,r.useState)([]),[B,I]=(0,r.useState)(""),[T,z]=(0,r.useState)(!0),[R,A]=(0,r.useState)(a),_=(e,s,l)=>{y({type:e,url:s,uuid:l.uuid}),"edit"===e?(A(!1),setTimeout(()=>{A(a),w(l)},100)):o().fire({icon:"info",title:"Delete data !!!",text:`Are You sure want to delete ${l.name??""} ?`,showCancelButton:!0,confirmButtonColor:"#d33",cancelButtonColor:"#686868",confirmButtonText:"Delete"}).then(e=>{e.isConfirmed&&E("delete",s,l.uuid,l)})},q=[];P?.[0]&&Object.keys(P[0]).map((e,s)=>{"uuid"==e||"addressJson"==e||"itemJson"==e||"docControlJson"==e||"json"==e||("img"===e?q.push({id:"img",header:()=>null,cell:({row:e})=>e.original.img?t.jsx("div",{className:"avatar-item avatar-lg d-flex align-items-center justify-content-center bg-primary-4 hp-bg-dark-primary text-primary hp-text-color-dark-0 rounded-circle",children:t.jsx(b(),{width:50,height:50,src:e.original.img,className:" object-cover rounded-full w-12 h-12",alt:e.original.name??e.original.uuid})}):t.jsx("div",{className:"avatar-item avatar-lg d-flex align-items-center justify-content-center bg-primary-4 hp-bg-dark-primary text-primary hp-text-color-dark-0 rounded-circle",children:(e.original.name??e.original.username).substring(0,2)}),footer:e=>e.column.id}):"status"===e?q.push({accessorKey:e,header:()=>t.jsx("div",{children:M(e)}),cell:({row:e})=>"active"===e.original.status?t.jsx("div",{className:"badge bg-success-4 hp-bg-dark-success text-success border-success",children:"active"}):"pending"===e.original.status?t.jsx("div",{className:"badge bg-warning-4 hp-bg-dark-warning text-warning border-warning",children:"pending"}):"inactive"===e.original.status?t.jsx("div",{className:"badge bg-danger-4 hp-bg-dark-danger text-danger border-danger",children:"inactive"}):void 0,footer:e=>e.column.id}):"permission"===e?q.push({accessorKey:e,header:()=>t.jsx("div",{children:M(e)}),cell:({row:e})=>(Array.isArray(e.original.permission)||(e.original.permission=JSON.parse(e.original.permission)),e.original.permission.map((e,s)=>t.jsx("div",{children:e.check?t.jsx(t.Fragment,{children:e.data.map((s,a)=>{if(!s.checklist)return s.data.map((s,a)=>{let l=!1,r=s.checklist.find(e=>"view"==e)?(0,t.jsxs)("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor",className:"w-4 h-4",children:[t.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"}),t.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M15 12a3 3 0 11-6 0 3 3 0 016 0z"})]}):null,n=s.checklist.find(e=>"create"==e)?t.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor",className:"w-4 h-4 text-blue-600",children:t.jsx("path",{fillRule:"evenodd",d:"M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z",clipRule:"evenodd"})}):null,i=s.checklist.find(e=>"edit"==e)?(0,t.jsxs)("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor",className:"w-4 h-4 text-green-600",children:[t.jsx("path",{d:"M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z"}),t.jsx("path",{d:"M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z"})]}):null,d=s.checklist.find(e=>"delete"==e)?t.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor",className:"w-4 h-4 text-red-600",children:t.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"})}):null;if(r&&(l=!0),l)return t.jsx("div",{className:"flex  w-full",children:(0,t.jsxs)("div",{className:"w-full",children:[e.label," ",s.label,(0,t.jsxs)("div",{className:"float-right w-13 flex",children:[r,n,i,d]})]})},a)});{let l=!1,r=s.checklist.find(e=>"view"==e)?(0,t.jsxs)("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor",className:"w-4 h-4",children:[t.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"}),t.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M15 12a3 3 0 11-6 0 3 3 0 016 0z"})]}):null,n=s.checklist.find(e=>"create"==e)?t.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor",className:"w-4 h-4 text-blue-600",children:t.jsx("path",{fillRule:"evenodd",d:"M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z",clipRule:"evenodd"})}):null,i=s.checklist.find(e=>"edit"==e)?(0,t.jsxs)("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor",className:"w-4 h-4 text-green-600",children:[t.jsx("path",{d:"M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z"}),t.jsx("path",{d:"M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z"})]}):null,d=s.checklist.find(e=>"delete"==e)?t.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor",className:"w-4 h-4 text-red-600",children:t.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"})}):null;if(r&&(l=!0),l)return t.jsx("div",{className:"flex  w-full",children:(0,t.jsxs)("div",{className:"w-full",children:[e.label," ",s.label,(0,t.jsxs)("div",{className:"float-right w-13 flex",children:[r,n,i,d]})]})},a)}})}):null},s))),footer:e=>e.column.id}):"ceklist"===e?q.push({id:"ceklist",header:()=>null,cell:({row:e})=>{if(e.original.ceklist)return!0===e.original.ceklist?t.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:2,stroke:"currentColor",className:"w-6 h-6 text-green-900",children:t.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M4.5 12.75l6 6 9-13.5"})}):(0,t.jsxs)("a",{href:e.original.ceklist,target:"_blank",className:"flex",children:[t.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:2,stroke:"currentColor",className:"w-6 h-6 text-green-900",children:t.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M4.5 12.75l6 6 9-13.5"})}),(0,t.jsxs)("svg",{xmlns:"http://www.w3.org/2000/svg",className:"w-3 -ml-5 h-3",viewBox:"0 0 24 24",fill:"none",children:[t.jsx("path",{d:"M15.0007 12C15.0007 13.6569 13.6576 15 12.0007 15C10.3439 15 9.00073 13.6569 9.00073 12C9.00073 10.3431 10.3439 9 12.0007 9C13.6576 9 15.0007 10.3431 15.0007 12Z",stroke:"#000000",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"}),t.jsx("path",{d:"M12.0012 5C7.52354 5 3.73326 7.94288 2.45898 12C3.73324 16.0571 7.52354 19 12.0012 19C16.4788 19 20.2691 16.0571 21.5434 12C20.2691 7.94291 16.4788 5 12.0012 5Z",stroke:"#000000",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})]})]})},footer:e=>e.column.id}):"item"===e?q.push({accessorKey:e,header:()=>t.jsx("div",{children:"Item"}),cell:e=>(0,t.jsxs)(t.Fragment,{children:[t.jsx("div",{"data-bs-toggle":"modal","data-bs-target":`#modalItem_${e.row.original.uuid}`,className:"cursor-pointer",children:t.jsx(h.Button,{size:"sm",color:"green",variant:"text",children:e.getValue()})}),t.jsx("div",{className:"modal fade",id:`modalItem_${e.row.original.uuid}`,tabIndex:-1,"aria-hidden":"true",children:t.jsx("div",{className:"modal-dialog modal-xl modal-dialog-centered",children:(0,t.jsxs)("div",{className:"modal-content",children:[(0,t.jsxs)("div",{className:"modal-header py-16 px-24",children:[(0,t.jsxs)("h5",{className:"modal-title font-bold",children:["Data No Faktur : ",e.row.original.noFaktur]}),t.jsx("button",{type:"button",className:"btn-close hp-bg-none d-flex align-items-center justify-content-center","data-bs-dismiss":"modal","aria-label":"Close",children:t.jsx("i",{className:"ri-close-line hp-text-color-dark-0 lh-1",style:{fontSize:"24px"}})})]}),t.jsx("div",{className:"divider m-0"}),t.jsx("div",{className:"overflow-auto",children:(0,t.jsxs)("table",{className:"table align-middle table-hover ",children:[t.jsx("thead",{children:(0,t.jsxs)("tr",{children:[t.jsx("td",{children:"Kode Barang"}),t.jsx("td",{children:"Nama"}),t.jsx("td",{children:"Harga"}),t.jsx("td",{children:"Jumlah"}),t.jsx("td",{children:"Total"}),t.jsx("td",{children:"Diskon"}),t.jsx("td",{children:"DPP"}),t.jsx("td",{children:"PPN"}),t.jsx("td",{children:"Tarif PPNBM"}),t.jsx("td",{children:"PPNBM"})]})}),(0,t.jsxs)("tbody",{children:[e.row.original.itemJson.map((e,s)=>(0,t.jsxs)("tr",{children:[t.jsx("td",{children:e.kodeBarang}),t.jsx("td",{children:e.nama}),t.jsx("td",{children:u()(e.hargaSatuan).format("0,0")}),t.jsx("td",{children:e.jumlahBarang}),t.jsx("td",{children:u()(e.hargaTotal).format("0,0")}),t.jsx("td",{children:u()(e.diskon).format("0,0")}),t.jsx("td",{children:u()(e.DPP).format("0,0")}),t.jsx("td",{children:u()(e.PPN).format("0,0")}),t.jsx("td",{children:u()(e.tarifPPNBM??0).format("0,0")}),t.jsx("td",{children:u()(e.PPNBM).format("0,0")})]},s)),(0,t.jsxs)("tr",{className:"bg-gray-200",children:[t.jsx("td",{children:"Total :"}),t.jsx("td",{}),t.jsx("td",{}),t.jsx("td",{children:u()(e.row.original.itemJson?.reduce((e,s)=>e+Number(s.jumlahBarang),0)).format("0,0")}),t.jsx("td",{children:u()(e.row.original.itemJson?.reduce((e,s)=>e+Number(s.hargaTotal),0)).format("0,0")}),t.jsx("td",{children:u()(e.row.original.itemJson?.reduce((e,s)=>e+Number(s.diskon),0)).format("0,0")}),t.jsx("td",{children:u()(e.row.original.itemJson?.reduce((e,s)=>e+Number(s.DPP),0)).format("0,0")}),t.jsx("td",{children:u()(e.row.original.itemJson?.reduce((e,s)=>e+Number(s.PPN),0)).format("0,0")}),t.jsx("td",{children:u()(e.row.original.itemJson?.reduce((e,s)=>e+Number(s.tarifPPNBM),0)).format("0,0")}),t.jsx("td",{children:u()(e.row.original.itemJson?.reduce((e,s)=>e+Number(s.PPNBM),0)).format("0,0")})]})]})]})}),t.jsx(h.Button,{className:"m-3","data-bs-dismiss":"modal","aria-label":"Close",children:"Close"})]})})})]}),footer:e=>e.column.id}):"docControl"===e?q.push({accessorKey:e,header:()=>t.jsx("div",{children:"Doc Control"}),cell:e=>(0,t.jsxs)(t.Fragment,{children:[t.jsx("div",{"data-bs-toggle":"modal","data-bs-target":`#modalItem_${e.row.original.uuid}`,className:"cursor-pointer",children:t.jsx(h.Button,{size:"sm",color:e.row.original.docControlJson.SJ_NO||e.row.original.docControlJson.SJ_TGLTRM||e.row.original.docControlJson.SJ_TGLDOC||e.row.original.docControlJson.TAG_NO||e.row.original.docControlJson.TAG_TGLDOC||e.row.original.docControlJson.TAG_TGLTRM||e.row.original.docControlJson.PEL_TGL||e.row.original.docControlJson.PEL_NOM||e.row.original.docControlJson.VIA?"green":"red",variant:"text",children:e.getValue()})}),t.jsx("div",{className:"modal fade",id:`modalItem_${e.row.original.uuid}`,tabIndex:-1,"aria-hidden":"true",children:t.jsx("div",{className:"modal-dialog modal-xl modal-dialog-centered",children:(0,t.jsxs)("div",{className:"modal-content",children:[(0,t.jsxs)("div",{className:"modal-header py-16 px-24",children:[(0,t.jsxs)("h5",{className:"modal-title font-bold",children:["Data No Faktur : ",e.row.original.noFaktur]}),t.jsx("button",{type:"button",className:"btn-close hp-bg-none d-flex align-items-center justify-content-center","data-bs-dismiss":"modal","aria-label":"Close",children:t.jsx("i",{className:"ri-close-line hp-text-color-dark-0 lh-1",style:{fontSize:"24px"}})})]}),t.jsx("div",{className:"divider m-0"}),t.jsx("div",{className:"overflow-auto",children:(0,t.jsxs)("table",{className:"table align-middle table-hover ",children:[(0,t.jsxs)("thead",{children:[(0,t.jsxs)("tr",{children:[t.jsx("td",{rowSpan:2,children:"Supplier"}),t.jsx("td",{colSpan:3,children:"Surat Jalan"}),t.jsx("td",{colSpan:3,children:"Faktur/Tagihan/Invoice"}),t.jsx("td",{colSpan:2,children:"Faktur Pajak"}),t.jsx("td",{colSpan:2,children:"Nilai Barang"}),t.jsx("td",{colSpan:3,children:"Pelunasan"})]}),(0,t.jsxs)("tr",{children:[t.jsx("td",{children:"Nomor"}),t.jsx("td",{children:"Tanggal"}),t.jsx("td",{children:"Terima"}),t.jsx("td",{children:"Nomor"}),t.jsx("td",{children:"Tanggal"}),t.jsx("td",{children:"Terima"}),t.jsx("td",{children:"Nomor"}),t.jsx("td",{children:"Tanggal"}),t.jsx("td",{children:"DPP"}),t.jsx("td",{children:"PPN"}),t.jsx("td",{children:"Tanggal"}),t.jsx("td",{children:"Nominal"}),t.jsx("td",{children:"Via"})]})]}),t.jsx("tbody",{children:(0,t.jsxs)("tr",{children:[t.jsx("td",{children:e.row.original.nama}),t.jsx("td",{children:e.row.original.docControlJson.SJ_NO}),t.jsx("td",{children:e.row.original.docControlJson.SJ_TGLDOC}),t.jsx("td",{children:e.row.original.docControlJson.SJ_TGLTRM}),t.jsx("td",{children:e.row.original.docControlJson.TAG_NO}),t.jsx("td",{children:e.row.original.docControlJson.TAG_TGLDOC}),t.jsx("td",{children:e.row.original.docControlJson.TAG_TGLTRM}),t.jsx("td",{children:e.row.original.noFaktur}),t.jsx("td",{children:e.row.original.date}),t.jsx("td",{children:e.row.original.amountDPP}),t.jsx("td",{children:e.row.original.amountPPN}),t.jsx("td",{children:e.row.original.docControlJson.PEL_TGL}),t.jsx("td",{children:e.row.original.docControlJson.PEL_NOM}),t.jsx("td",{children:e.row.original.docControlJson.VIA})]})})]})}),t.jsx(h.Button,{className:"m-3","data-bs-dismiss":"modal","aria-label":"Close",children:"Close"})]})})})]}),footer:e=>e.column.id}):"check"===e?q.push({id:"check",header:e=>t.jsx(h.Checkbox,{type:"checkbox",id:"checkALl",onChange:e=>{var s=document.querySelectorAll('input[type="checkbox"]');if(e.target.checked)for(var a=0;a<s.length;a++)"checkbox"==s[a].type&&(s[a].checked=!0);else for(var a=0;a<s.length;a++)"checkbox"==s[a].type&&(s[a].checked=!1)}}),cell:({row:e})=>(0,t.jsxs)("div",{className:"flex",children:[e.original.check.checkbox?t.jsx(h.Checkbox,{id:`checkItem_${e.original.uuid}`}):null,e.original.check.ceklist?t.jsx(t.Fragment,{children:""===e.original.check.ceklist?t.jsx("div",{className:"mt-2",children:t.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:2,stroke:"currentColor",className:"w-6 h-6 text-green-900",children:t.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M4.5 12.75l6 6 9-13.5"})})}):(0,t.jsxs)("a",{href:e.original.check.ceklist,target:"_blank",className:"flex mt-3",children:[t.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:2,stroke:"currentColor",className:"w-6 h-6 text-green-900",children:t.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M4.5 12.75l6 6 9-13.5"})}),(0,t.jsxs)("svg",{xmlns:"http://www.w3.org/2000/svg",className:"w-3 -ml-5 h-3",viewBox:"0 0 24 24",fill:"none",children:[t.jsx("path",{d:"M15.0007 12C15.0007 13.6569 13.6576 15 12.0007 15C10.3439 15 9.00073 13.6569 9.00073 12C9.00073 10.3431 10.3439 9 12.0007 9C13.6576 9 15.0007 10.3431 15.0007 12Z",stroke:"#000000",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"}),t.jsx("path",{d:"M12.0012 5C7.52354 5 3.73326 7.94288 2.45898 12C3.73324 16.0571 7.52354 19 12.0012 19C16.4788 19 20.2691 16.0571 21.5434 12C20.2691 7.94291 16.4788 5 12.0012 5Z",stroke:"#000000",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})]})]})}):null]}),footer:e=>e.column.id}):"userCompany"===e?q.push({accessorKey:e,header:()=>t.jsx("div",{children:"Users"}),cell:e=>t.jsx("div",{className:"text-xs",children:e.getValue().map((e,s)=>e.username+", ")}),footer:e=>e.column.id}):q.push({accessorKey:e,header:()=>t.jsx("div",{children:"npwp"===e?"NPWP":M(e)}),cell:e=>e.getValue()?e.getValue().length>35?`${e.getValue()}`.substring(0,35)+"...":e.getValue():"-",footer:e=>e.column.id}))});let D=[...q,{id:"action",header:()=>null,cell:({row:e})=>s.edit&&s.delete?(0,t.jsxs)(t.Fragment,{children:[t.jsx("i",{onClick:()=>{_("edit",s.edit,e.original)},"data-bs-toggle":"modal","data-bs-target":"#editUser",className:"iconly-Curved-Edit hp-cursor-pointer hp-transition hp-hover-text-color-primary-1 text-black-80",style:{fontSize:"24px"}}),t.jsx("i",{onClick:()=>{_("delete",s.delete,e.original)},className:"ml-2 iconly-Light-Delete hp-cursor-pointer hp-transition hp-hover-text-color-danger-1 text-black-80",style:{fontSize:"24px"}})]}):s.edit?t.jsx("i",{onClick:()=>{_("edit",s.edit,e.original)},"data-bs-toggle":"modal","data-bs-target":"#editUser",className:"iconly-Curved-Edit hp-cursor-pointer hp-transition hp-hover-text-color-primary-1 text-black-80",style:{fontSize:"24px"}}):s.delete?t.jsx("i",{onClick:()=>{_("delete",s.delete,e.original)},className:"iconly-Light-Delete hp-cursor-pointer hp-transition hp-hover-text-color-danger-1 text-black-80",style:{fontSize:"24px"}}):"-"}],G=(0,p.useReactTable)({data:P,columns:D,filterFns:{fuzzy:C},state:{columnFilters:J,globalFilter:B},onColumnFiltersChange:F,onGlobalFilterChange:I,globalFilterFn:C,getCoreRowModel:(0,p.getCoreRowModel)(),getFilteredRowModel:(0,p.getFilteredRowModel)(),getSortedRowModel:(0,p.getSortedRowModel)(),getPaginationRowModel:(0,p.getPaginationRowModel)(),getFacetedRowModel:(0,p.getFacetedRowModel)(),getFacetedUniqueValues:(0,p.getFacetedUniqueValues)(),getFacetedMinMaxValues:(0,p.getFacetedMinMaxValues)()}),E=async(e,s=null,a=null,l=null)=>{let t=JSON.parse(localStorage.getItem("companyActive"))?.value;if(null!==l&&(l.company_id=JSON.parse(localStorage.getItem("companyActive"))?.value),"edit"===e)try{await (0,n.default)({method:"PUT",url:s+"/"+a,data:l,headers:{Authorization:`Bearer ${localStorage.getItem("token")}`,"Content-Type":"application/json"}}).then(e=>{i.default.success(e.data.massage),E("view"),$(".btn-close").trigger("click")})}catch(e){i.default.error(e.response.data.massage)}else if("delete"===e)try{await (0,n.default)({method:"DELETE",url:s+"/"+a,headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}}).then(e=>{"/api/company/"===s&&e.data.uuid===JSON.parse(localStorage.getItem("companyActive"))?.value&&localStorage.removeItem("companyActive"),i.default.success(e.data.massage),E("view")})}catch(e){i.default.error(e.response.data.massage)}else if("view"===e){let e="";v&&(e+="start_date="+v[0]+"&end_date="+v[1]);try{await (0,n.default)({method:"GET",url:d+(t?"?company_id="+JSON.parse(localStorage.getItem("companyActive"))?.value+"&"+e:"?"+e),headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}}).then(e=>{S(e.data.data),L&&G.setPageIndex(L),setTimeout(()=>{z(!1)},100)})}catch(e){console.log(e)}}};return T?(0,t.jsxs)("div",{className:"animate-pulse mx-5",children:[t.jsx("div",{className:"h-4 bg-gray-200 mt-3 mb-6 rounded"}),t.jsx("div",{className:"h-4 bg-gray-300 mb-6 rounded"}),t.jsx("div",{className:"h-4 bg-gray-200 mb-6 rounded"}),t.jsx("div",{className:"h-4 bg-gray-300 mb-6 rounded"}),t.jsx("div",{className:"h-4 bg-gray-200 mb-6 rounded"})]}):P.length?($("#nophoneEdit").mask("(+62) 000-0000-0000"),(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)("div",{className:"table-responsive",children:[(0,t.jsxs)("table",{className:"table align-middle table-hover  text-sm -mb-2",children:[t.jsx("thead",{children:G.getHeaderGroups().map(e=>t.jsx("tr",{children:e.headers.map(e=>t.jsx("th",{colSpan:e.colSpan,children:e.isPlaceholder?null:(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)("div",{className:e.column.getCanSort()?"cursor-pointer select-none text-center flex justify-center":"",onClick:e.column.getToggleSortingHandler(),children:[(0,p.flexRender)(e.column.columnDef.header,e.getContext()),{asc:t.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor",className:"w-4 h-4",children:t.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75"})}),desc:t.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor",className:"w-4 h-4",children:t.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M12 4.5v15m0 0l6.75-6.75M12 19.5l-6.75-6.75"})})}[e.column.getIsSorted()]??null]}),e.column.getCanFilter()?t.jsx("div",{className:"mt-2 text-sm",children:t.jsx(k,{column:e.column,table:G})}):null]})},e.id))},e.id))}),(0,t.jsxs)("tbody",{children:[G.getRowModel().rows.map(e=>t.jsx("tr",{className:e.original?.ceklist?"bg-green-100":"",children:e.getVisibleCells().map(e=>t.jsx("td",{children:(0,p.flexRender)(e.column.columnDef.cell,e.getContext())},e.id))},e.id)),G.getPrePaginationRowModel().rows.length?null:t.jsx("tr",{children:t.jsx("td",{colSpan:G.getHeaderGroups()[0].headers.length,className:"text-center",children:"Not Data Result"})})]})]}),t.jsx("div",{className:"h-2"})]}),(0,t.jsxs)("div",{className:"flex flex-wrap items-center gap-2 mt-3 ml-5",children:[t.jsx("button",{className:"border rounded p-1",onClick:()=>G.setPageIndex(0),disabled:!G.getCanPreviousPage(),children:"<<"}),t.jsx("button",{className:"border rounded p-1",onClick:()=>G.previousPage(),disabled:!G.getCanPreviousPage(),children:"<"}),t.jsx("button",{className:"border rounded p-1",onClick:()=>{G.nextPage(),V(G.getState().pagination.pageIndex+1)},disabled:!G.getCanNextPage(),children:">"}),t.jsx("button",{className:"border rounded p-1",onClick:()=>G.setPageIndex(G.getPageCount()-1),disabled:!G.getCanNextPage(),children:">>"}),(0,t.jsxs)("span",{className:"flex items-center gap-1",children:[t.jsx("div",{children:"Page"}),(0,t.jsxs)("strong",{children:[G.getState().pagination.pageIndex+1," of"," ",G.getPageCount()," |  Total ",G.getPrePaginationRowModel().rows.length," Rows"]})]}),(0,t.jsxs)("span",{className:"flex items-center gap-1",children:["| Go to page:",t.jsx("input",{type:"number",defaultValue:G.getState().pagination.pageIndex+1,onChange:e=>{let s=e.target.value?Number(e.target.value)-1:0;G.setPageIndex(s)},className:"border p-1 rounded w-16"})]}),t.jsx("select",{value:G.getState().pagination.pageSize,onChange:e=>{G.setPageSize(Number(e.target.value))},children:[10,20,30,40,50].map(e=>(0,t.jsxs)("option",{value:e,children:["Show ",e]},e))})]}),t.jsx("div",{className:"modal fade",id:"editUser",tabIndex:-1,"aria-labelledby":"editUserLabel","aria-hidden":"true",children:t.jsx("div",{className:"modal-dialog modal-xl modal-dialog-centered",children:(0,t.jsxs)("div",{className:"modal-content",children:[(0,t.jsxs)("div",{className:"modal-header py-16 px-24",children:[(0,t.jsxs)("h5",{className:"modal-title font-bold",id:"editUserLabel",children:["Edit ",c]}),t.jsx("button",{type:"button",className:"btn-close hp-bg-none d-flex align-items-center justify-content-center","data-bs-dismiss":"modal","aria-label":"Close",children:t.jsx("i",{className:"ri-close-line hp-text-color-dark-0 lh-1",style:{fontSize:"24px"}})})]}),t.jsx("div",{className:"divider m-0"}),R?t.jsx(t.Fragment,{children:(0,t.jsxs)("form",{onSubmit:e=>{e.preventDefault();let s=new FormData($("#editForm")[0]);E("edit",d,f.uuid,s)},id:"editForm",children:[t.jsx("div",{className:"modal-body",children:t.jsx("div",{className:"row gx-8",children:R?.map((e,s)=>{let a=f?.userCompany?.map(e=>({label:e.username,value:e.uuid}));return t.jsx("div",{className:e.full?"col-12 col-md-12":"col-12 col-md-6",children:"text"===e.type||"number"===e.type||"email"===e.type||"date"===e.type?t.jsx("div",{className:"mb-24",children:t.jsx(h.Input,{required:e.required,label:M(e.name),variant:"standard",className:"border-b-1",type:e.type,defaultValue:"date"===e.type&&f?.[e.name]?m()(f?.[e.name],"DD/MM/YYYY").format("YYYY-MM-DD"):f?.[e.name]?f?.[e.name]:"",name:e.name,id:`${e.id}Edit`})}):"group"===e.type?t.jsxs("div",{className:"mb-24",children:[e.label||e.name?t.jsxs("label",{htmlFor:e.id,className:"form-label",children:[t.jsx("span",{className:"text-danger me-4",children:"*"}),M(e.label??e.name)]}):null,t.jsx("div",{className:"input-group",children:e.group.map((s,a)=>t.jsx("input",{type:s.type,required:e.required,defaultValue:f?.address?f?.addressJson[s.name]:f?.[e.name],readOnly:s.readOnly,placeholder:s.placeholder,name:s.name,className:"form-control"},a))})]}):"textarea"===e.type?t.jsx("div",{className:"mb-24",children:t.jsx(h.Textarea,{required:e.required,label:M(e.name),variant:"standard",className:"border-b-1",defaultValue:f?.[e.name]?f?.[e.name]:"",name:e.name,id:`${e.id}Edit`})}):"reactSelect"===e.type?t.jsx("div",{className:"mb-24",children:t.jsx(g.Z,{id:`${e.id}Edit`,name:e.name,data:e.select,required:e.required,label:M(e.name),defaultValue:f?.[e.name]?{label:M(f?.[e.name]),value:f?.[e.name]}:""})}):"address"===e.type?t.jsx("div",{className:"w-full",children:t.jsx("div",{className:"mb-3",children:t.jsxs("div",{className:"border-1 border-gray-500 p-2 rounded-lg shadow-sm",children:[t.jsx("label",{className:"-mt-5 absolute bg-white px-1 text-gray-500",children:"Address"}),t.jsxs("div",{className:"xl:flex",children:[t.jsx("div",{className:"mt-3 w-full",children:t.jsx(h.Input,{defaultValue:f?.addressJson?.jalan,required:!0,name:"jalan",className:"border-b-1",type:"text",variant:"standard",label:"Jalan"})}),t.jsx("div",{className:"mt-3 w-full",children:t.jsx(h.Input,{defaultValue:f?.addressJson?.block,required:!0,name:"block",className:"border-b-1",type:"text",variant:"standard",label:"Block"})}),t.jsx("div",{className:"mt-3 w-full",children:t.jsx(h.Input,{defaultValue:f?.addressJson?.no,required:!0,name:"no",className:"border-b-1",type:"number",variant:"standard",label:"No"})}),t.jsx("div",{className:"mt-3 w-full",children:t.jsx(h.Input,{defaultValue:f?.addressJson?.rt,required:!0,name:"rt",className:"border-b-1",type:"number",variant:"standard",label:"RT"})}),t.jsx("div",{className:"mt-3 w-full",children:t.jsx(h.Input,{defaultValue:f?.addressJson?.rw,required:!0,name:"rw",className:"border-b-1",type:"number",variant:"standard",label:"RW"})})]}),t.jsxs("div",{className:"xl:flex",children:[t.jsx("div",{className:"mt-3 w-full",children:t.jsx(h.Input,{defaultValue:f?.addressJson?.kec,required:!0,name:"kec",className:"border-b-1",type:"text",variant:"standard",label:"Kecamatan"})}),t.jsx("div",{className:"mt-3 w-full",children:t.jsx(h.Input,{defaultValue:f?.addressJson?.kel,required:!0,name:"kel",className:"border-b-1",type:"text",variant:"standard",label:"Keluarahan"})}),t.jsx("div",{className:"mt-3 w-full",children:t.jsx(h.Input,{defaultValue:f?.addressJson?.prov,required:!0,name:"prov",className:"border-b-1",type:"text",variant:"standard",label:"Provinsi"})}),t.jsx("div",{className:"mt-3 w-full",children:t.jsx(h.Input,{defaultValue:f?.addressJson?.kabkot,required:!0,name:"kabkot",className:"border-b-1",type:"text",variant:"standard",label:"Kabupaten/Kota"})}),t.jsx("div",{className:"mt-3 w-full",children:t.jsx(h.Input,{defaultValue:f?.addressJson?.kodepos,required:!0,name:"kodepos",className:"border-b-1",type:"number",variant:"standard",label:"Kode POS"})})]})]})})}):"permission"===e.type?t.jsxs("div",{children:[t.jsx("input",{type:"hidden",value:JSON.stringify(e.data),name:"format"}),t.jsxs("div",{className:"flex mb-3",children:[t.jsx("div",{className:"w-1/2"}),t.jsx("div",{className:"w-1/6 justify-center flex",children:t.jsx(h.IconButton,{size:"sm",children:t.jsxs("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor",className:"w-4 h-4",children:[t.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"}),t.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M15 12a3 3 0 11-6 0 3 3 0 016 0z"})]})})}),t.jsx("div",{className:"w-1/6 justify-center flex",children:t.jsx(h.IconButton,{color:"blue",size:"sm",children:t.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor",className:"w-4 h-4",children:t.jsx("path",{fillRule:"evenodd",d:"M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z",clipRule:"evenodd"})})})}),t.jsx("div",{className:"w-1/6  justify-center flex",children:t.jsx(h.IconButton,{color:"green",size:"sm",children:t.jsxs("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor",className:"w-4 h-4",children:[t.jsx("path",{d:"M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z"}),t.jsx("path",{d:"M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z"})]})})}),t.jsx("div",{className:"w-1/6  justify-center flex",children:t.jsx(h.IconButton,{color:"red",size:"sm",children:t.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor",className:"w-4 h-4",children:t.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"})})})})]}),e.data.map((e,s)=>t.jsxs("div",{children:[t.jsx("div",{className:"flex mt-3 font-bold",children:t.jsx("div",{className:"w-1/2",children:e.label})}),e.data.map((s,a)=>s?.name?t.jsxs("div",{className:"flex mt-1 ml-2",children:[t.jsxs("div",{className:"w-1/2 ml-2 m-auto",children:[" ",s.label]}),t.jsx("div",{className:"w-1/6 justify-center flex",children:t.jsx(j.Z,{name:s.name,id:f?.name+e.label+s.name+a+1,checked:!!s?.checklist.find(e=>"view"===e)})}),t.jsx("div",{className:"w-1/6 justify-center flex",children:t.jsx(j.Z,{color:"blue",name:s.name,id:f?.name+e.label+s.name+a+2,checked:!!s?.checklist.find(e=>"create"===e)})}),t.jsx("div",{className:"w-1/6  justify-center flex",children:t.jsx(j.Z,{color:"green",name:s.name,id:f?.name+e.label+s.name+a+3,checked:!!s?.checklist.find(e=>"edit"===e)})}),t.jsx("div",{className:"w-1/6  justify-center flex",children:t.jsx(j.Z,{color:"red",name:s.name,id:f?.name+e.label+s.name+a+4,checked:!!s?.checklist.find(e=>"delete"===e)})})]},a):t.jsxs("div",{className:"ml-2",children:[t.jsx("div",{className:"flex my-2 font-semibold",children:t.jsx("div",{className:"w-1/2",children:s.label})}),s.option.map((a,l)=>{let r=f?.permission.find(s=>s.label===e.label)?.data.find(e=>e.label===s.label)?.data?.find(e=>e.name===a.name);return t.jsxs("div",{className:"flex mt-1 ml-2",children:[t.jsxs("div",{className:"w-1/2 ml-2 m-auto",children:[" ",a.label]}),t.jsx("div",{className:"w-1/6 justify-center flex",children:t.jsx(j.Z,{name:a.name,id:f?.name+s.label+a.name+l+1,checked:!!r?.checklist.find(e=>"view"===e)})}),t.jsx("div",{className:"w-1/6 justify-center flex",children:t.jsx(j.Z,{color:"blue",name:a.name,id:f?.name+s.label+a.name+l+2,checked:!!r?.checklist.find(e=>"create"===e)})}),t.jsx("div",{className:"w-1/6  justify-center flex",children:t.jsx(j.Z,{color:"green",name:a.name,id:f?.name+s.label+a.name+l+3,checked:!!r?.checklist.find(e=>"edit"===e)})}),t.jsx("div",{className:"w-1/6  justify-center flex",children:t.jsx(j.Z,{color:"red",name:a.name,id:f?.name+s.label+a.name+l+4,checked:!!r?.checklist.find(e=>"delete"===e)})})]},l)})]},a))]},s))]}):"selectMulti"===e.type?t.jsxs("div",{className:"mb-24",children:[t.jsxs("label",{className:"form-label font-normal",children:[M(e.label??e.name),t.jsx("span",{className:"text-danger",children:"*"})]}),t.jsx(g.Z,{multi:!0,mergeDataValue:!0,name:e.name,data:e.select,required:e.required,defaultValue:a})]}):null},s)})})}),(0,t.jsxs)("div",{className:"modal-footer pt-0 px-24 pb-24",children:[t.jsx("div",{className:"divider"}),t.jsx(h.Button,{type:"submit",className:"w-full",color:"blue",children:"Edit"})]})]})}):null,!1==R?t.jsx("div",{children:t.jsx("div",{className:"text-center w-full mt-52 mb-52",children:t.jsx("div",{className:"spinner-border",role:"status"})})}):null]})})})]})):(0,t.jsxs)("div",{className:"text-center w-full text-gray-500",children:[(0,t.jsxs)("div",{className:"flex justify-center -mt-10 -mb-7 ",children:[t.jsx(b(),{src:"/img/noResult.gif",width:200,height:200,alt:"noResult"})," "]}),t.jsx("div",{className:"text-lg",children:"No results found"})]})}function k({column:e,table:s}){let a=s.getPreFilteredRowModel().flatRows[0]?.getValue(e.id),l=e.getFilterValue(),n=(0,r.useMemo)(()=>"number"==typeof a?[]:Array.from(e.getFacetedUniqueValues().keys()).sort(),[e.getFacetedUniqueValues()]);return"number"==typeof a&&"phone"!==e.id?(0,t.jsxs)("div",{className:"text-center",children:[(0,t.jsxs)("div",{className:"flex space-x-2",children:[t.jsx(y,{type:"number",min:Number(e.getFacetedMinMaxValues()?.[0]??""),max:Number(e.getFacetedMinMaxValues()?.[1]??""),value:l?.[0]??"",onChange:s=>e.setFilterValue(e=>[s,e?.[1]]),placeholder:`Min ${e.getFacetedMinMaxValues()?.[0]?`(${e.getFacetedMinMaxValues()?.[0]})`:""}`,className:"w-24 border text-xs p-1 rounded"}),t.jsx(y,{type:"number",min:Number(e.getFacetedMinMaxValues()?.[0]??""),max:Number(e.getFacetedMinMaxValues()?.[1]??""),value:l?.[1]??"",onChange:s=>e.setFilterValue(e=>[e?.[0],s]),placeholder:`Max ${e.getFacetedMinMaxValues()?.[1]?`(${e.getFacetedMinMaxValues()?.[1]})`:""}`,className:"w-24 border text-xs p-1 rounded"})]}),t.jsx("div",{className:"h-1"})]}):(0,t.jsxs)("div",{className:"text-center",children:[t.jsx("datalist",{id:e.id+"list",children:n.slice(0,5e3).map((e,s)=>t.jsx("option",{value:e},s))}),t.jsx(y,{type:"text",value:l??"",onChange:s=>e.setFilterValue(s),placeholder:`Search... (${e.getFacetedUniqueValues().size})`,className:"w-36 border rounded p-1 text-xs",list:e.id+"list"}),t.jsx("div",{className:"h-1"})]})}function y({value:e,onChange:s,debounce:a=500,...l}){let[n,i]=(0,r.useState)(e);return t.jsx("input",{...l,value:n,onChange:e=>i(e.target.value)})}l()}catch(e){l(e)}})},1070:(e,s,a)=>{a.r(s),a.d(s,{default:()=>r});var l=a(997),t=a(6859);function r(){return(0,l.jsxs)(t.Html,{lang:"en",children:[(0,l.jsxs)(t.Head,{children:[l.jsx("link",{rel:"icon",href:"/img/logo.png"}),l.jsx("link",{href:"https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap",rel:"stylesheet"}),l.jsx("link",{rel:"stylesheet",type:"text/css",href:"/app-assets/css/plugin/swiper-bundle.min.css"}),l.jsx("link",{rel:"stylesheet",type:"text/css",href:"/app-assets/icons/iconly/index.min.css"}),l.jsx("link",{rel:"stylesheet",type:"text/css",href:"/app-assets/icons/remix-icon/index.min.css"}),l.jsx("link",{rel:"stylesheet",type:"text/css",href:"/app-assets/css/bootstrap.css"}),l.jsx("link",{rel:"stylesheet",type:"text/css",href:"/app-assets/css/colors.css"}),l.jsx("link",{rel:"stylesheet",type:"text/css",href:"/app-assets/css/base/typography.css"}),l.jsx("link",{rel:"stylesheet",type:"text/css",href:"/app-assets/css/base/base.css"}),l.jsx("link",{rel:"stylesheet",type:"text/css",href:"/app-assets/css/theme/colors-dark.css"}),l.jsx("link",{rel:"stylesheet",type:"text/css",href:"/app-assets/css/theme/theme-dark.css"}),l.jsx("link",{rel:"stylesheet",type:"text/css",href:"/app-assets/css/custom-rtl.css"}),l.jsx("link",{rel:"stylesheet",type:"text/css",href:"/app-assets/css/layouts/sider.css"}),l.jsx("link",{rel:"stylesheet",type:"text/css",href:"/app-assets/css/layouts/header.css"}),l.jsx("link",{rel:"stylesheet",type:"text/css",href:"/app-assets/css/layouts/page-content.css"}),l.jsx("link",{rel:"stylesheet",type:"text/css",href:"/app-assets/css/components.css"}),l.jsx("link",{rel:"stylesheet",type:"text/css",href:"/app-assets/css/plugin/apex-charts.css"}),l.jsx("link",{rel:"stylesheet",type:"text/css",href:"/app-assets/css/pages/dashboard-analytics.css"}),l.jsx("link",{rel:"stylesheet",type:"text/css",href:"/app-assets/css/pages/authentication.css"}),l.jsx("link",{rel:"stylesheet",type:"text/css",href:"/app-assets/css/pages/page-profile.css"}),l.jsx("link",{rel:"stylesheet",type:"text/css",href:"/app-assets/css/pages/app-contact.css"}),l.jsx("link",{rel:"stylesheet",type:"text/css",href:"/assets/css/style.css"})]}),(0,l.jsxs)("body",{children:[l.jsx(t.Main,{}),l.jsx(t.NextScript,{})]})]})}},5244:(e,s)=>{var a;Object.defineProperty(s,"x",{enumerable:!0,get:function(){return a}}),function(e){e.PAGES="PAGES",e.PAGES_API="PAGES_API",e.APP_PAGE="APP_PAGE",e.APP_ROUTE="APP_ROUTE"}(a||(a={}))}};