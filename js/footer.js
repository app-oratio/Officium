if(!document.getElementById("footer-css")){
const link = document.createElement("link");
link.id = "footer-css";
link.rel = "stylesheet";
link.href = "/css/footer.css";
document.head.appendChild(link);
}

class SiteFooter extends HTMLElement {

connectedCallback(){

const year = new Date().getFullYear();

this.innerHTML = `
<footer class="site-footer">

<div class="footer-content">

<div class="footer-brand">

<img src="/icons/white-128.png" class="footer-logo">

<div class="footer-title">
<strong>Officium</strong><br>
<span>Liturgia diária e Liturgia das Horas.</span>
</div>

</div>

<div class="footer-text">

<p>© ${year} Oratio App Católico</p>

<p class="footer-note">
Os textos litúrgicos pertencem à © CNBB - Conferência Nacional dos Bispos do Brasil. Este site tem finalidade exclusivamente apostólica.
</p>

</div>

</div>

</footer>
`;

}

}

customElements.define("site-footer", SiteFooter);
