(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{103:function(e,t,a){},115:function(e,t,a){e.exports=a(239)},195:function(e,t,a){},197:function(e,t,a){},231:function(e,t,a){},235:function(e,t,a){},237:function(e,t,a){},239:function(e,t,a){"use strict";a.r(t);var n=a(1),l=a.n(n),r=a(106),o=a.n(r),i=a(31),c=a(14),s=a(27),m=a(16),d=a(15),u=a(17),p=a(247),h=a(240),g=a(248),E=a(241),f=a(242),b=function(e){return l.a.createElement(p.a,{inverse:!0,collapseOnSelect:!0},l.a.createElement(p.a.Header,null,l.a.createElement(p.a.Brand,null,l.a.createElement("a",{href:"#brand"},"Employee Name")),l.a.createElement(p.a.Toggle,null)),l.a.createElement(p.a.Collapse,null,l.a.createElement(h.a,null,l.a.createElement(g.a,{eventKey:1,title:"Work Stations",id:"basic-nav-dropdown"},e.stations.map(function(t){return l.a.createElement(E.a,{"data-id":t.id,key:t.id,onClick:e.handleStationSelect},t.name)}))),l.a.createElement(h.a,{pullRight:!0},l.a.createElement(f.a,{eventKey:1,href:"#profile"},"Profile"),l.a.createElement(f.a,{eventKey:2,href:"#logout",onClick:e.handleLogout},"Logout"))))},v=a(11),y=a.n(v),S=(a(195),function(e){return l.a.createElement("div",{className:"col-sm-6 col-md-4"},l.a.createElement("div",{className:"thumbnail card"},l.a.createElement("div",{className:"caption"},l.a.createElement("h5",{className:"card-title"},e.title),l.a.createElement("p",{className:"card-text"},e.text),e.inProgress?l.a.createElement("button",{value:e.id,type:"button",className:"btn btn-danger",onClick:e.onToggle},"Stop"):l.a.createElement("button",{value:e.id,type:"button",className:"btn btn-success",onClick:e.onToggle},"Start"))))}),k=a(243),N=(a(197),function(e){function t(e){var a;return Object(c.a)(this,t),(a=Object(m.a)(this,Object(d.a)(t).call(this,e))).handleStationSelect=function(e){y.a.get("/api/v1/workorders/active/".concat(e.target.getAttribute("data-id"))).then(function(e){var t=[];e.data.forEach(function(e){return t.push(Object(i.a)({},e,{inProgress:!1}))}),a.setState({workOrders:t})})},a.handleLogout=function(){y.a.post("/api/v1/auth/logout").then(function(e){!0===e.data.signedOut&&(sessionStorage.clear(),window.location.replace("/"))})},a.handleJobStart=function(e){var t=e.target.value,n=a.state.workOrders.slice(0);n.forEach(function(e){e.id===t?e.inProgress=!0:e.inProgress=!1}),a.setState({workOrders:n})},a.handleJobStop=function(e){var t=a.state.workOrders.slice(0);t.forEach(function(e){e.inProgress=!1}),a.setState({workOrders:t})},a.state={stations:[],workOrders:[]},y.a.get("/api/v1/stations/all").then(function(e){return a.setState({stations:e.data})}),a}return Object(u.a)(t,e),Object(s.a)(t,[{key:"componentWillMount",value:function(){var e=this;y.a.post("/api/v1/auth/verify",{token:sessionStorage.getItem("token")}).then(function(t){t.data.uid===sessionStorage.getItem("uid")?e.setState({isLoggedIn:!0}):sessionStorage.clear()}).catch(function(e){console.log(e)})}},{key:"render",value:function(){var e=this;return this.state.isLoggedIn?l.a.createElement("div",{className:"b"},l.a.createElement(b,{stations:this.state.stations,handleStationSelect:this.handleStationSelect,handleLogout:this.handleLogout}),l.a.createElement("div",{className:"container"},this.state.workOrders.map(function(t){return t.inProgress?l.a.createElement(S,{key:t.id,id:t.id,onToggle:e.handleJobStop,inProgress:t.inProgress,text:t.text,title:"this is a work order"}):l.a.createElement(S,{key:t.id,id:t.id,onToggle:e.handleJobStart,inProgress:t.inProgress,text:t.text,title:"this is a work order"})}))):l.a.createElement("div",null,l.a.createElement("h1",null,"You are not logged in"),l.a.createElement(k.a,{to:"/"},"login"))}}]),t}(l.a.Component)),w=a(250),O=a(251),C=a(246),I=a(244),j=a(245),A=a(249),P=(a(103),a(70));a(105);var x=function(e){return l.a.createElement("div",null,l.a.createElement("h2",null,l.a.createElement("span",{className:"label label-primary",style:{float:"left",marginRight:"7px"}},e.stationName)),l.a.createElement("button",{"data-id":e.id,className:"btn btn-danger",onClick:e.removeStation},"x"))},B=function(e){function t(e){var a;return Object(c.a)(this,t),(a=Object(m.a)(this,Object(d.a)(t).call(this,e))).componentWillMount=function(){y.a.get("/api/v1/stations/all").then(function(e){return a.setState({stations:e.data,selectedStation:e.data[0],loaded:!0})})},a.componentDidMount=function(){var e=sessionStorage.getItem("editPart");"false"!==e&&e&&(e=JSON.parse(e),a.setState({part:e},function(){document.getElementById("part-id").value=a.state.part.id,document.getElementById("part-name").value=a.state.part.name})),sessionStorage.setItem("editPart",!1)},a.removeStation=function(e){e.preventDefault();var t=e.target.getAttribute("data-id"),n=Object.assign(a.state.part),l=a.state.part.stations.slice(0);l.forEach(function(e,a){e.id===t&&l.splice(a,1)}),n.stations=l,a.setState({part:n})},a.showModal=function(){return a.setState({showModal:!0})},a.hideModal=function(){return a.setState({showModal:!1})},a.handleSelectChange=function(e){var t=e.target.value,n=e.target.children[e.target.selectedIndex].text;a.setState({selectedStation:{id:t,name:n}})},a.addStation=function(){var e=Object.assign(a.state.part);e.stations.push(a.state.selectedStation),a.setState({part:e,showModal:!1,selectedStation:a.state.stations[0]})},a.handleInput=function(e){var t=e.target.name,n=Object.assign(a.state.part);n[t]=e.target.value,a.setState({part:n})},a.clear=function(){document.getElementById("part-id").value="",document.getElementById("attachment").value="",document.getElementById("part-name").value="",a.setState({part:{id:"",stations:[]}})},a.handleSubmit=function(){if(a.state.part.stations.length<1)console.log("Please select a minimum of one station");else{var e=document.getElementById("attachment").files[0];if(void 0!==e){var t=new FileReader;t.onloadend=function(t){var n=new Blob([t.target.result],{type:e.type});y.a.post("/api/v1/parts/create",{part:Object(i.a)({},a.state.part,{filename:e.name})}).then(function(t){a.clear(),P.storage().ref("/".concat(t.data.newPartID,"/").concat(e.name)).put(n).then(function(){return console.log("success")},function(){return console.log("error")})})},t.readAsArrayBuffer(e)}else y.a.post("/api/v1/parts/create",{part:Object(i.a)({},a.state.part,{filename:"no file"})}).then(function(e){return a.clear()}).catch(function(e){return console.log(e)})}},a.render=function(){return l.a.createElement("div",{className:"container"},l.a.createElement("div",{className:"row"},l.a.createElement("div",{className:"col-sm-4"},l.a.createElement("form",{id:"part-form",action:"/api/v1/parts/test",method:"POST"},l.a.createElement("div",{className:"input-group"},l.a.createElement("span",{className:"input-group-addon",id:"part-number-addon"},"Part ID"),l.a.createElement("input",{name:"id",id:"part-id",onChange:a.handleInput,type:"text",className:"form-control",placeholder:"If left blank an ID will be auto-generated","aria-describedby":"part-number-addon"})),l.a.createElement("div",{className:"input-group"},l.a.createElement("span",{className:"input-group-addon",id:"part-name-addon"},"Part Name"),l.a.createElement("input",{name:"name",id:"part-name",onChange:a.handleInput,type:"text",className:"form-control"})),l.a.createElement("div",{className:"input-group"},l.a.createElement("input",{name:"doc",id:"attachment",onChange:a.handleInput,type:"file",className:"form-control","aria-describedby":"part-document-addon"})),a.state.part.stations?a.state.part.stations.map(function(e,t){return l.a.createElement(x,{key:t,stationName:e.name,id:e.id,removeStation:a.removeStation})}):""),l.a.createElement("br",null),l.a.createElement("button",{className:"btn btn-success",onClick:a.showModal},"Add Station"),l.a.createElement("br",null),l.a.createElement("hr",null),l.a.createElement("button",{className:"btn btn-success",onClick:a.handleSubmit},"Submit"),l.a.createElement("button",{className:"btn btn-danger",onClick:a.clear},"Clear"),l.a.createElement(C.a,{show:a.state.showModal},l.a.createElement(C.a.Title,null,"Select a Station"),l.a.createElement(I.a,null,l.a.createElement(j.a,null,"Stations"),l.a.createElement(A.a,{componentClass:"select",placeholder:"Select a station",onChange:a.handleSelectChange},a.state.loaded?a.state.stations.map(function(e){return l.a.createElement("option",{key:e.id,value:e.id},e.name)}):"Loading ...")),l.a.createElement(I.a,null,l.a.createElement("button",{className:"btn btn-success",onClick:a.addStation},"OK"),l.a.createElement("button",{className:"btn btn-danger",onClick:a.hideModal},"Cancel"))))))},a.state={selectedStation:{},stations:[],part:{id:"",name:"",doc:"",stations:[]},showModal:!1,loaded:!1},a}return Object(u.a)(t,e),t}(l.a.Component),M=a(70);a(105),a(222);M.initializeApp({apiKey:"AIzaSyAZB-qbjpKVRvaQt17kPsPTMav3O12by6k",authDomain:"project-runner-f1bdc.firebaseapp.com",databaseURL:"https://project-runner-f1bdc.firebaseio.com",projectId:"project-runner-f1bdc",storageBucket:"project-runner-f1bdc.appspot.com",messagingSenderId:"757776283780"});var T=function(e){return l.a.createElement("div",{className:"row"},e.parts.map(function(t,a){return l.a.createElement(D,{key:a,title:t.name,stations:t.stations,filepath:t.filepath,viewAttachment:e.viewAttachment,handleEdit:e.handleEdit,id:t.id,handleDelete:e.handleDelete})}))},D=function(e){return l.a.createElement("div",{className:"col-sm-6 col-md-4"},l.a.createElement("div",{className:"thumbnail"},l.a.createElement("div",{className:"caption"},l.a.createElement("h3",{className:"card-title"},e.title),l.a.createElement("p",null,l.a.createElement("strong",null,"Stations: ")),e.stations.map(function(e,t){return l.a.createElement("p",{key:"".concat(e.id).concat(t)},e.name)}),l.a.createElement("button",{className:"btn btn-primary","data-filepath":e.filepath,onClick:e.viewAttachment},"View Attachment"),l.a.createElement("button",{style:{marginLeft:"10px"},className:"btn btn-warning","data-id":e.id,onClick:e.handleEdit},"Edit"),l.a.createElement("button",{style:{marginLeft:"10px"},className:"btn btn-danger","data-id":e.id,onClick:e.handleDelete},"Delete"))))},L=function(e){function t(e){var a;return Object(c.a)(this,t),(a=Object(m.a)(this,Object(d.a)(t).call(this,e))).componentWillMount=function(){y.a.get("/api/v1/parts/all").then(function(e){return a.setState({parts:e.data})})},a.componentDidMount=function(){var e=setInterval(function(){y.a.get("/api/v1/parts/all").then(function(e){return a.setState({parts:e.data})})},15e3);a.setState({interval:e})},a.componentWillUnmount=function(){clearInterval(a.state.interval)},a.handleTabSelect=function(e){for(var t=e.target,a=document.getElementsByClassName("tab-link"),n=0;n<a.length;n++)a[n].setAttribute("class","tab-link");t.parentElement.setAttribute("class","active tab-link")},a.viewAttachment=function(e){M.storage().ref(e.target.getAttribute("data-filepath")).getDownloadURL().then(function(e){return window.open(e,"_blank")})},a.handleEdit=function(e){var t=e.target.getAttribute("data-id");y.a.get("/api/v1/parts/edit/".concat(t)).then(function(e){sessionStorage.setItem("editPart",JSON.stringify(e.data)),document.getElementById("create-link").click()})},a.handleDelete=function(e){var t=e.target.getAttribute("data-id");y.a.put("/api/v1/parts/archive/".concat(t)).then(function(e){y.a.get("/api/v1/parts/all").then(function(e){return a.setState({parts:e.data})})})},a.render=function(e){return l.a.createElement("div",{className:"container"},l.a.createElement("ul",{className:"nav nav-pills"},l.a.createElement("li",{role:"presentation",className:"active tab-link",onClick:a.handleTabSelect},l.a.createElement(k.a,{to:"/admin/parts/view"},"View")),l.a.createElement("li",{role:"presentation",className:"tab-link",onClick:a.handleTabSelect},l.a.createElement(k.a,{id:"create-link",to:"/admin/parts/create"},"Create"))),l.a.createElement("br",null),l.a.createElement("br",null),l.a.createElement(O.a,{path:"/admin/parts/create",component:B}),l.a.createElement(O.a,{path:"/admin/parts/view",component:function(){return l.a.createElement(T,{parts:a.state.parts,viewAttachment:a.viewAttachment,handleEdit:a.handleEdit,handleDelete:a.handleDelete})}}))},a.state={parts:[],interval:0},a}return Object(u.a)(t,e),t}(l.a.Component),J=a(77),K=a.n(J),R=a(114),W=function(e){function t(e){var a;return Object(c.a)(this,t),(a=Object(m.a)(this,Object(d.a)(t).call(this,e))).handleSelectChange=function(e){var t=e.target.value,n=e.target.children[e.target.selectedIndex].text;a.setState({selectedStation:{id:t,name:n}})},a.addEmployee=function(){var e=Object.assign(a.state.employee);a.setState({employee:e,showModal:!1})},a.handleInput=function(e){var t=e.target.name,n=Object.assign(a.state.employee);n[t]=e.target.value,a.setState({employee:n})},a.clear=function(){document.getElementById("employee-id").value="",a.setState({employee:{id:""}})},a.handleSubmit=Object(R.a)(K.a.mark(function e(){return K.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(console.log(a.state.employee),!(a.state.employee.name.length<1)){e.next=6;break}return console.log("Name your employee before submitting"),e.abrupt("return");case 6:y.a.post("/api/v1/auth/create",{employee:Object(i.a)({},a.state.employee)}).then(function(){document.getElementById("employee-id").value="",document.getElementById("employee-name").value="",document.getElementById("employee-email").value="",document.getElementById("employee-password").value=""}).catch(function(e){return console.log(e)});case 7:case"end":return e.stop()}},e,this)})),a.state={employee:{id:"",name:"",email:"",password:""}},y.a.get("/api/v1/stations/all").then(function(e){return a.setState({stations:e.data,selectedStation:e.data[0]})}),a}return Object(u.a)(t,e),Object(s.a)(t,[{key:"render",value:function(){return l.a.createElement("div",{className:"container"},l.a.createElement("div",{className:"row"},l.a.createElement("div",{className:"col-sm-4"},l.a.createElement("form",{id:"employee-form",action:"/api/v1/employees/test",method:"POST"},l.a.createElement("div",{className:"input-group"},l.a.createElement("span",{className:"input-group-addon",id:"employee-number-addon"},"Employee ID"),l.a.createElement("input",{name:"id",id:"employee-id",onChange:this.handleInput,type:"text",className:"form-control",placeholder:"If left blank an ID will be auto-generated","aria-describedby":"employee-number-addon"})),l.a.createElement("div",{className:"input-group"},l.a.createElement("span",{className:"input-group-addon",id:"employee-name-addon"},"Employee Name"),l.a.createElement("input",{name:"name",id:"employee-name",onChange:this.handleInput,type:"text",className:"form-control",placeholder:"First and Last Name","aria-describedby":"part-name-addon"})),l.a.createElement("div",{className:"input-group"},l.a.createElement("span",{className:"input-group-addon",id:"employee-email-addon"},"Employee Email"),l.a.createElement("input",{name:"email",id:"employee-email",onChange:this.handleInput,type:"email",className:"form-control",placeholder:"Email","aria-describedby":"part-email-addon"})),l.a.createElement("div",{className:"input-group"},l.a.createElement("span",{className:"input-group-addon",id:"employee-password-addon"},"Employee Password"),l.a.createElement("input",{name:"password",id:"employee-password",onChange:this.handleInput,type:"password",className:"form-control",placeholder:"Password","aria-describedby":"part-password-addon"}))),l.a.createElement("br",null),l.a.createElement("hr",null),l.a.createElement("button",{className:"btn btn-success",onClick:this.handleSubmit},"Submit"),l.a.createElement("button",{className:"btn btn-danger",onClick:this.clear},"Clear"))))}}]),t}(l.a.Component),F=(a(230),function(e){return l.a.createElement("div",{className:"row"},e.employees.map(function(t){return l.a.createElement(U,{key:t.id,title:t.name,id:t.id,email:t.email,isAdmin:t.isAdmin,handleTogglePermission:e.handleTogglePermission})}))}),U=function(e){return l.a.createElement("div",{className:"col-sm-6 col-md-4"},l.a.createElement("div",{className:"thumbnail"},l.a.createElement("div",{className:"caption"},l.a.createElement("h3",{className:"card-title"},e.title),l.a.createElement("p",null,l.a.createElement("strong",null,"Email: ",e.email," ")),l.a.createElement("p",null,l.a.createElement("strong",null,"Admin Rights? ",e.isAdmin?"Yes":"No"," "))),l.a.createElement("div",null,l.a.createElement("button",{className:"btn ".concat(e.isAdmin?"btn-danger":"btn-success"),onClick:e.handleTogglePermission,"data-id":e.id,"data-is-admin":e.isAdmin},e.isAdmin?"Revoke Admin":"Make Admin"))))},V=function(e){function t(e){var a;return Object(c.a)(this,t),(a=Object(m.a)(this,Object(d.a)(t).call(this,e))).componentWillMount=function(){y.a.get("/api/v1/employees/all").then(function(e){return a.setState({employees:e.data})})},a.componentDidMount=function(){var e=setInterval(function(){y.a.get("/api/v1/employees/all").then(function(e){return a.setState({employees:e.data})})},15e3);a.setState({interval:e})},a.componentWillUnmount=function(){clearInterval(a.state.interval)},a.handleTabSelect=function(e){for(var t=e.target,a=document.getElementsByClassName("tab-link"),n=0;n<a.length;n++)a[n].setAttribute("class","tab-link");t.parentElement.setAttribute("class","active tab-link")},a.handleTogglePermission=function(e){var t=e.target.getAttribute("data-id"),n=e.target.getAttribute("data-is-admin");y.a.put("/api/v1/employees/togglepermission",{id:t,isAdmin:n}).then(function(e){y.a.get("/api/v1/employees/all").then(function(e){return a.setState({employees:e.data})})})},a.render=function(e){return l.a.createElement("div",{className:"container"},l.a.createElement("ul",{className:"nav nav-pills"},l.a.createElement("li",{role:"presentation",className:"active tab-link",onClick:a.handleTabSelect},l.a.createElement(k.a,{to:"/admin/employees/view"},"View")),l.a.createElement("li",{role:"presentation",className:"tab-link",onClick:a.handleTabSelect},l.a.createElement(k.a,{to:"/admin/employees/create"},"Create"))),l.a.createElement("br",null),l.a.createElement("br",null),l.a.createElement(O.a,{path:"/admin/employees/create",component:W}),l.a.createElement(O.a,{path:"/admin/employees/view",component:function(){return l.a.createElement(F,{employees:a.state.employees,handleTogglePermission:a.handleTogglePermission})}}))},a.state={employees:[],interval:0},a}return Object(u.a)(t,e),t}(l.a.Component),Y=function(e){function t(e){var a;return Object(c.a)(this,t),(a=Object(m.a)(this,Object(d.a)(t).call(this,e))).handleClick=function(e){e.preventDefault();var t=e.target.getAttribute("data-ref");document.getElementById(t).click()},a.handleLogout=function(){y.a.post("/api/v1/auth/logout").then(function(e){!0===e.data.signedOut&&(sessionStorage.clear(),window.location.replace("/"))})},a.render=function(e){return l.a.createElement(w.a,null,l.a.createElement("div",null,l.a.createElement(p.a,{inverse:!0,collapseOnSelect:!0},l.a.createElement(p.a.Header,null,l.a.createElement(p.a.Brand,null,l.a.createElement("a",{href:"/","data-ref":"admin",onClick:a.handleClick},"Admin Name")),l.a.createElement(p.a.Toggle,null)),l.a.createElement(p.a.Collapse,null,l.a.createElement(h.a,null,l.a.createElement(f.a,{eventKey:1,"data-ref":"stations",title:"Work Stations",onClick:a.handleClick},"Work Stations")),l.a.createElement(h.a,null,l.a.createElement(f.a,{eventKey:2,"data-ref":"jobs",title:"Jobs",onClick:a.handleClick},"Jobs")),l.a.createElement(h.a,null,l.a.createElement(f.a,{eventKey:3,title:"parts","data-ref":"parts",onClick:a.handleClick},"Parts")),l.a.createElement(h.a,null,l.a.createElement(f.a,{eventKey:4,"data-ref":"employees",title:"Employees",onClick:a.handleClick},"Employees")),l.a.createElement(h.a,{pullRight:!0},l.a.createElement(f.a,{eventKey:2,"data-ref":"logout",onClick:a.handleLogout},"Logout")))),l.a.createElement(k.a,{to:"/admin/parts/view",id:"parts"}),l.a.createElement(k.a,{to:"/admin/stations",id:"stations"}),l.a.createElement(k.a,{to:"/admin/jobs",id:"jobs"}),l.a.createElement(k.a,{to:"/admin/employees/view",id:"employees"}),l.a.createElement(k.a,{to:"/admin",id:"admin"}),l.a.createElement(k.a,{to:"/",id:"logout"}),l.a.createElement(O.a,{path:"/admin/parts",component:L}),l.a.createElement(O.a,{path:"/admin/employees",component:V})))},a.state={ref:null},a}return Object(u.a)(t,e),t}(l.a.Component),z=(a(231),a(70));a(233),z.auth().setPersistence(z.auth.Auth.Persistence.SESSION);var H=function(e){function t(e){var a;return Object(c.a)(this,t),(a=Object(m.a)(this,Object(d.a)(t).call(this,e))).handleStationSelect=function(e){y.a.get("/api/v1/workorders/active/".concat(e.target.getAttribute("data-id"))).then(function(e){var t=[];e.data.forEach(function(e){return t.push(Object(i.a)({},e,{inProgress:!1}))}),a.setState({workOrders:t})})},a.state={stations:[],workOrders:[],isLoggedIn:!1},y.a.get("/api/v1/stations/all").then(function(e){return a.setState({stations:e.data})}),a}return Object(u.a)(t,e),Object(s.a)(t,[{key:"componentWillMount",value:function(){var e=this;y.a.post("/api/v1/auth/verify",{token:sessionStorage.getItem("token")}).then(function(t){t.data.uid===sessionStorage.getItem("uid")?e.setState({isLoggedIn:!0}):sessionStorage.clear()}).catch(function(e){console.log(e)})}},{key:"render",value:function(){var e=this;return"true"!==sessionStorage.getItem("isAdmin")?l.a.createElement("div",{className:"c"},l.a.createElement("div",{className:"container"},l.a.createElement("h1",null,"You are not an Admin"),l.a.createElement(k.a,{to:"/employee"},"Go to Employee Page"))):this.state.isLoggedIn?l.a.createElement("div",null,l.a.createElement(Y,{stations:this.state.stations,handleStationSelect:this.handleStationSelect}),l.a.createElement("div",{className:"container"},this.state.workOrders.map(function(t){return t.inProgress?l.a.createElement(S,{key:t.id,id:t.id,onToggle:e.handleJobStop,inProgress:t.inProgress,text:t.text,title:"this is a work order"}):l.a.createElement(S,{key:t.id,id:t.id,onToggle:e.handleJobStart,inProgress:t.inProgress,text:t.text,title:"this is a work order"})}))):l.a.createElement("div",{className:"d"},l.a.createElement("div",{className:"container"},l.a.createElement("h1",null,"You are not logged in"),l.a.createElement(k.a,{to:"/"},"login")))}}]),t}(l.a.Component),q=a(55),G=(a(235),a(252)),Q=function(e){function t(e){var a;return Object(c.a)(this,t),(a=Object(m.a)(this,Object(d.a)(t).call(this,e))).handleInput=function(e){var t=e.target.name,n=e.target.value;a.setState(Object(q.a)({},t,n))},a.handleCheckBox=function(e){var t=e.target.checked;a.setState({rememberMe:t})},a.handleSubmit=function(e){a.setState({err:{}}),e.preventDefault(),y.a.post("api/v1/auth/login",{email:a.state.email,password:a.state.password}).then(function(e){e.data.err?a.setState({err:e.data.err}):(!0===a.state.rememberMe?localStorage.setItem("email",a.state.email):localStorage.removeItem("email"),sessionStorage.setItem("isAdmin",e.data.isAdmin),sessionStorage.setItem("uid",e.data.uid),sessionStorage.setItem("token",e.data.token),a.setState({isAdmin:e.data.isAdmin}))})},a.state={err:null,email:localStorage.getItem("email")||null,password:null,rememberMe:!!localStorage.getItem("email")},a}return Object(u.a)(t,e),Object(s.a)(t,[{key:"componentDidMount",value:function(){this.state.email&&(document.getElementById("exampleCheck1").click(),document.getElementById("exampleInputEmail1").value=this.state.email)}},{key:"render",value:function(e){return!0===this.state.isAdmin?l.a.createElement(G.a,{to:"/admin"}):!1===this.state.isAdmin?l.a.createElement(G.a,{to:"/employee"}):l.a.createElement("div",{className:"form-align"},l.a.createElement("form",{className:"loginForm"},l.a.createElement("div",null,l.a.createElement("h3",null,"Sign In")),l.a.createElement("div",{className:"form-group"},l.a.createElement("label",{htmlFor:"exampleInputEmail1"},"Email address"),l.a.createElement("input",{name:"email",onChange:this.handleInput,type:"email",className:"form-control",id:"exampleInputEmail1",placeholder:"Enter Email"})),l.a.createElement("div",{className:"form-group"},l.a.createElement("label",{htmlFor:"exampleInputPassword1"},"Password"),l.a.createElement("input",{name:"password",onChange:this.handleInput,type:"password",className:"form-control",id:"exampleInputPassword1",placeholder:"Password"})),l.a.createElement("div",{className:"form-check"},l.a.createElement("input",{name:"rememberMe",onChange:this.handleCheckBox,type:"checkbox",className:"form-check-input",id:"exampleCheck1"}),l.a.createElement("label",{className:"form-check-label",htmlFor:"exampleCheck1"},"Remember me")),l.a.createElement("button",{type:"Submit",className:"btn btn-primary",onClick:this.handleSubmit},"Submit")),l.a.createElement("h5",{style:{color:"red"}},this.state.err?this.state.err.message:""))}}]),t}(l.a.Component),Z=(a(237),function(e){function t(){return Object(c.a)(this,t),Object(m.a)(this,Object(d.a)(t).apply(this,arguments))}return Object(u.a)(t,e),Object(s.a)(t,[{key:"render",value:function(){return l.a.createElement("div",{className:"a"},l.a.createElement("div",{className:"container"},l.a.createElement("div",{className:"row"},l.a.createElement("div",{className:"col-sm-3"},l.a.createElement(Q,null)))))}}]),t}(l.a.Component)),X=function(e){return l.a.createElement(w.a,null,l.a.createElement("div",null,l.a.createElement(O.a,{exact:!0,path:"/",component:Z}),l.a.createElement(O.a,{path:"/admin",component:H}),l.a.createElement(O.a,{exact:!0,path:"/employee",component:N})))};o.a.render(l.a.createElement(X,null),document.getElementById("root"))}},[[115,2,1]]]);
//# sourceMappingURL=main.9b43631f.chunk.js.map