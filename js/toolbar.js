if(!document.getElementById("toolbar-css")){
const link = document.createElement("link");
link.id = "toolbar-css";
link.rel = "stylesheet";
link.href = "/CSS/toolbar.css";
document.head.appendChild(link);
}

class SiteToolbar extends HTMLElement {

connectedCallback(){

this.innerHTML = `
<div class="toolbar">

    <div class="toolbar-left">
        <img src="/icons/white-128.png" class="toolbar-icon">
        <span class="toolbar-title">Officium</span>
    </div>

    <div class="toolbar-right">
        <img src="/icons/nav/menu-128.png" class="toolbar-menu" id="menuButton">
    </div>

</div>

<div class="drawer-overlay" id="drawerOverlay"></div>

<div class="drawer" id="drawer">

    <div class="drawer-header">
        <a href="https://officium.oratioapp.com.br/">
            <img src="/icons/white-128.png" class="drawer-logo">
            <span class="drawer-title">Officium</span>
        </a>
    </div>

    <div class="drawer-items">

        <a href="https://officium.oratioapp.com.br/oficio-das-leituras">Ofício das Leituras</a>
        <a href="/laudes">Laudes</a>
        <a href="/terca">Hora Terça</a>
        <a href="/sexta">Hora Sexta</a>
        <a href="/nona">Hora Nona</a>
        <a href="/vesperas">Vésperas</a>
        <a href="/completas">Completas</a>
        <a href="/calendario">Calendário Litúrgico</a>
        <a href="/ordinario-da-missa">Ordinário da Missa</a>
        <a href="https://oratioapp.com.br/ajude-nos">Ajude-nos</a>

    </div>

    <div class="drawer-footer">
        <span>Desenvolvido por:</span>
        <a href="https://oratioapp.com.br">Oratio App</a>
    </div>

</div>
`;

this.setupEvents();
}

setupEvents(){

const menu = this.querySelector("#menuButton");
const drawer = this.querySelector("#drawer");
const overlay = this.querySelector("#drawerOverlay");

menu.onclick = function(){
drawer.classList.add("open");
overlay.classList.add("show");
};

overlay.onclick = function(){
drawer.classList.remove("open");
overlay.classList.remove("show");
};

}

}

customElements.define("site-toolbar", SiteToolbar);
