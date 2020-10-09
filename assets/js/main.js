/*** IIFE - pozivanje anonimne funckije da se izvrsi odmah po ucitavanju stranice ***/
(function ($) {
    console.log("Radi");
    /*------------------
        Preloader
    --------------------*/
    $(window).on('load', function () {
        $(".loader").fadeOut();
        $("#preloder").delay(200).fadeOut("slow");
    });

   /*------------------
        Scroll, navigation and mobile view
    --------------------*/
    $(window).scroll(function(){
        let top = $(this)[0].scrollY;
        if(top > 530){
            $("#scrollTop").show();
        } else {
            $("#scrollTop").hide();
        }

        if(top > 530){
            $("#menu").css({
                "background-color": "#272727",
            });
            $("#menu .nav a").css({
                "color": "#888888",
            });
            $("#menu i.far").css({
                "color": "#f44336;",
            });
            $("#menu i.fas").css({
                "color": "rgb(255, 145, 0);",
            });
        }
        else{
            $("#menu").css({"background-color": '#fff'});
        }
    });
    $("#mob").hide(), 
    /** ES6 - Arrow f-ja **/
	$("#mob li a").click(() => {
        $("#mob").slideUp('medium')
    })
    
    $("#hamburgerIkonica").addClass('senka').on("click", (() => {
        $("#mob").animate({
            width: "toggle"
        })
       /** postavljanje loga za mobilne uredjaje u trenutku klika na "hamburger" ikonicu**/
        var slikaLogoMob = `<a href="index.html">
                                <img src="assets/images/logo1Mob.png" alt="logo" class="logoMob"/>
                            </a>`;
        var logoMob = document.getElementsByClassName("logoHeaderMob");
        for(let i=0;i<logoMob.length;i++){
            logoMob[i].innerHTML =  slikaLogoMob;
        }
    }))

    /** ajax zahtev za navigacioni meni **/ 
    $.ajax({
        url:"assets/data/menu.json",
        method:"get",
        dataType: "json",
        success:function(data){
            console.log(data);
            ispisMenija(data);
        },
        error:function(xhr, status, error){
            console.log("Doslo je do greske" + "-" + error + ":" + status);
        }
    })

    // modali
    var linkAutor=document.getElementById("autor");
    var zatvori=document.getElementById("zatvori0");
    linkAutor.addEventListener("click",otvoriModal);
    zatvori.addEventListener("click",zatvoriModal);

    var btnObavestenje = document.getElementById('btnNewsletterEmail');
    btnObavestenje.addEventListener('click',ispisiZahvalnost);
    document.getElementById('formaKontakt').addEventListener("click",proveraKontaktForme);


    prikaziDrustveneMreze();
    prikaziNajnovijeProizvode();
    klijenti();
    ispisiPogodnosti();

})(jQuery);

   /*------------------
       Funkcija koja ispisuje navigacioni meni dinamicki iz JSON fajla (za desktop, tablete, tako i za mobilne uredjaje)
    --------------------*/
    function ispisMenija(data){
        let nav = "<ul>"
        let slikaLogo = `<a href="index.html">
                            <img src="assets/images/logo1.png" alt="logo" class="logo"/>
                        </a>`;
        data.forEach(meni => {
            nav +=`<li><a class="closeNavSide" href="${meni.putanja}">${meni.naziv}</a></li>`
        });
        nav += "</ul>"

        let navMob = document.getElementsByClassName("nav");
        var logo = document.getElementsByClassName("logoHeader");
        for(let i=0; i<navMob.length;i++){
            navMob[i].innerHTML += nav;
        }
        for(let i=0;i<logo.length;i++){
            logo[i].innerHTML =  slikaLogo;
        }
    }

//modal - autor
function otvoriModal(){
    document.getElementById("modal0").style.display="block"
}
function zatvoriModal(){
    document.getElementById("modal0").style.display="none"
}

var modal = document.getElementById('modal0');
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

    //dinamicki ispisivanje pogodnosti
function ispisiPogodnosti(){
    let pogodnostiBlok = document.getElementById("pogodnosti");
    let ispisPogodnosti="";
    const pogodnosti = [
        {
            id:1,
            slika:{
                putanja:"assets/images/offer.png ",
                alt:" ponuda"
            },
            naslov:"Zagarantovano najbolje cene ",
            opis: " Stalne akcije, sniženja cena i poklona uz kupovinu, promocije uz asistenciju obučenih promotera i konsultanata, specijalne mogućnosti tokom Happy Day, uslovi plaćanja uskladjeni sa mogućnostima kupaca....odlika su Glow&Go kozmetičkih prodavnica."
        },
        {
            id:2,
            slika:{
                putanja:"assets/images/like.png ",
                alt:"ljubav prema klijentima "
            },
            naslov:"Iskustvo i lojalnost ",
            opis: " Verujemo da je dobra komunikacija značajan preduslov uspešnog poslovanja - profesionalnost i timski rad su razlozi zbog kojih uspešno gradimo mrežu lojalnih klijenata. Svaki kupac nam je važan, stoga je naše ljubazno osoblje uvek spremno da Vam pomogne i prepozna Vaše potrebe."
        },
        {
            id:3,
            slika:{
                putanja:"assets/images/call-center.png ",
                alt:"dostupnost"
            },
            naslov:"Stalno usavršavanje ",
            opis: " Jedna od ključnih vrednosti naše kompanije je konstantan proces učenja i usavršavanja, zbog čega smo redovni posetioci najznačajnijih svetskih dešavanja iz oblasti lepote. Redovno komuniciramo sa istaknutim svetskim i domaćim stručnjacima, kako bi samo pažljivo odabrani brendovi ušli u našu ponudu."
        },
        {
            id:4,
            slika:{
                putanja:"assets/images/support.png ",
                alt:"podrska "
            },
            naslov:"Naša posvećena podrška ",
            opis: "Želimo da su naši kupci uvek zadovoljni i zato im pružamo niz različitih mogućnosti kao što je vraćanje proizvoda uz priloženi račun. Veoma nam je stalo da obezbedimo dobru uslugu našim kupcima i zato Vam zaposleni u dm prodavnicama stoje na raspolaganju za svaki savet i svako pitanje. "
        }
    ]

    for(const pogodnost of pogodnosti){
        ispisPogodnosti += 
        `
            <article class="adventage col-xl-3 col-lg-4 col-ms-6 col-sm-12">
                <img src=${pogodnost.slika.putanja} alt=${pogodnost.slika.alt} \/>
                <h3><strong>${pogodnost.naslov}</strong></h3>
                <p>${pogodnost.opis}</p>
            </article>
        `;
    }
    pogodnostiBlok.innerHTML = ispisPogodnosti;   
   
}
//end


    //dinamicki ispisivanje reci klijenata
function klijenti(){
        let klijentiBlok = document.getElementById('klijenti');
        let ispisKlijenata = "";
        const klijenti = [
            {
                slicica: "fa-paper-plane",
                opis: "Pozdrav! Samo želim da vam se puno zahvalim na svoj vašoj pomoći prilikom odabira kozmetičkih prozvoda za jedan od većih događaja. Apsolutno mi se sve dopada. Htela bih da predložim ovu prodavnicu svima onima kojima je potrebna podrška i puna pomoč prilikom odabira nečeg zaista bitnog...",
                imePrezimeGodine: "Jovana Petrović, 26 godina",
                zanimanje: "Marketing menadžer"
            },
            {
                slicica: "fa-user",
                opis: "Želela bih da se zahvalim u svoje ime i ime svoje sestre na vašim uslugama i pomoći prilikom odabira šminke za svadbu na kojoj smo skoro otišle. Ona je prezadovoljna uslugom i najverovatnije će se vratiti u skorije vreme po još kozmetike, pre nego otputuje u Englesku na jedno putovanje...",
                imePrezimeGodine: "Ivana Janković, 22 godina",
                zanimanje: "Arhitekta"
            },
            {
                slicica: "fa-paper-plane",
                opis: "Veliko vam hvala na svemu što ste učinili prilikom odabira onih pravih kozmetičkih proizvoda za moju problematičnu kožu na licu. Svima bih preporučio vaše proizvode, kao i sve usluge koje nudite. Veoma ste prijatni i klijenti mogu da vas pitaju bilo kakvo pitanje u vezi lepote i kako održati taj glamurozni sjaj..",
                imePrezimeGodine: "Jovan Pešić,35 godina",
                zanimanje: "Web programer"
            }
        ]
        for(const klijent of klijenti){
            ispisKlijenata += 
            `
                <article class="client col-lg-3 col-ms-6 col-sm-12">
                    <span><i class="fas ${klijent.slicica}"></i></span>
                        <div class="textClient">
                            <p>
                                ${klijent.opis}
                            </p>
                            <h2><em><strong> ${klijent.imePrezimeGodine} </strong></em></h2>
                            <h3><em> ${klijent.zanimanje} </em></h3>
                        </div>
                </article>
            `;
        }
        klijentiBlok.innerHTML = ispisKlijenata;    
}
//end

    /*** Dinamicki ispis DropDown liste za sortiranje i upis u div#sort ***/
    function prikaziDrustveneMreze (){
        let ispisListeMreza = "";
        const drustveneMreze = [
            {
                putanja:"https://www.facebook.com/",
                ikonica:"fab fa-facebook" 
            },
            {
                putanja:"https://www.instagram.com/",
                ikonica:"fab fa-instagram" 
            },
            {
                putanja:"https://twitter.com/",
                ikonica:"fab fa-twitter" 
            } 
        ]
        for(const mreza of drustveneMreze){
            ispisListeMreza += 
            `<li>
                <a href="${mreza.putanja}" target="_blank">
                    <i class="${mreza.ikonica}"></i>
                </a>
            </li>`;
        }
        $("#aboutUs ul").append(ispisListeMreza);
    };

function prikaziNajnovijeProizvode (){
    $.ajax({
        url:"assets/data/products.json",
        method:"get",
        success:proizvodi =>{
            console.log(proizvodi)
            ispisNajnovijaTriProizvoda(proizvodi);
            ispisRandomCetiriProizvoda(proizvodi);
        }
    })
}

/* ispis najnovija 4 proizvoda (ES6 - upotreba arrow operatora)--> prvo ih sortiramo po datumu, onda odsečemo 4 poslednja sa slice metodom i zatim ispišemo te proizvode */
ispisNajnovijaTriProizvoda = proizvodi => {
    proizvodi.sort((a, b) => {
        const datumA = new Date(a.datumUnosa);
        const datumB = new Date(b.datumUnosa);
        return Date.UTC(datumB.getFullYear(), datumB.getMonth(), datumB.getDate()) - Date.UTC(datumA.getFullYear(), datumA.getMonth(), datumA.getDate()); 
    });
      const najnovijaTriProizvoda = proizvodi.slice(0, 4); 
        let ispisProizvoda = "";
        najnovijaTriProizvoda.forEach(p => {
            ispisProizvoda += 
            `
                <article class="proizvod-top col-xl-3 col-lg-4 col-md-6 col-sm-12 artikal-items">
                    <div class="image-top">
                        <a href="#">
                            <img src="${p.slika.putanja}" alt="${p.slika.alt}" class="img-fluid product-top" />
                        </a>
                        <div class="overImage-top">
                            <img src="assets/images/oznaka.png" alt="flag"/>
                         </div>
                    </div>
                    <div class="tekstProizvod-top">
                        <h2>${p.naziv}</h2>
                        <div class="info-product-price my-2">
                            <span class="item_price text-dark font-weight-bold">${p.cena.snizeno}RSD</span>
                            <sup><del>${p.cena.original}RSD</del></sup>
                        </div>
                        <a href="shop.html">
                            <input type="button" title="pogledaj u prodavnici" data-toggle="tooltip" data-placement="bottom" value="Prodavnica" class="button btn see-in-shop" />
                        </a>
                    </div>
                </article>
            `;
        })
        document.getElementById("recentArticles").innerHTML = ispisProizvoda;
        
}

    /******* Recommended *******/
    /*---------------- DINAMIČKO ISPISIVANJE 4 RANDOM PROIZVODA   -----------------------------*/
function ispisRandomCetiriProizvoda(proizvodi){
        var containerProizvodi =  document.querySelector("#recommendArticles");
        let ispisProizvoda = "";
        
        var nizVrednosti = Object.values(proizvodi);
        console.log(nizVrednosti);

        /**  funkcija kojoj prosledjujemo željeni niz i koliko članova istog želimo da prikažemo nasumično **/
        function getRandom(nizVrednosti, n) {
            var noviNiz = new Array(n),
                duzinaNiza = nizVrednosti.length,
                uzeto = new Array(duzinaNiza);
            /* ako je broj članova koji smo prosledili veći od ukupne dužine datog niza, baciće se izuzetak */
            if (n > duzinaNiza)
                throw new RangeError("getRandom: uzeto je vise elemenata od ukupnog broja.");
            while (n--) {
                var x = Math.floor(Math.random() * duzinaNiza);
                noviNiz[n] = nizVrednosti[x in uzeto ? uzeto[x] : x];
                uzeto[x] = --duzinaNiza in uzeto ? uzeto[duzinaNiza] : duzinaNiza;
            }
            return noviNiz;
        }

        /** ispisivanje 4 random proizvoda  **/
        for(const pr of getRandom(nizVrednosti,4)){
            ispisProizvoda += 
            `
            <article class="proizvod-top col-xl-3 col-lg-4 col-md-6 col-sm-12 artikal-items">
                <div class="image-top">
                    <a href="#">
                        <img src="${pr.slika.putanja}" alt="${pr.slika.alt}" class="img-fluid product-top" />
                    </a>
                    <div class="overImage-recomm">
                        <img src="assets/images/oznakaRecommend.png" alt="flag"/>
                        </div>
                </div>
                <div class="tekstProizvod-top">
                    <h2>${pr.naziv}</h2>
                    <div class="info-product-price my-2">
                        <span class="item_price text-dark font-weight-bold">${pr.cena.snizeno}RSD</span>
                        <sup><del>${pr.cena.original}RSD</del></sup>
                    </div>
                    <a href="shop.html">
                        <input type="button" title="pogledaj u prodavnici" data-toggle="tooltip" data-placement="bottom" value="Prodavnica" class="button btn see-in-shop" />
                    </a>
                </div>
            </article>
            `
        }   
        containerProizvodi.innerHTML = ispisProizvoda;
}

    /*-------------------------
        Provera kontakt forme -> validacija newsletter i kontakt forme
    ---------------------------*/

    //kad se subscribe-ujemo mejlom
function ispisiZahvalnost(){
    let validNewsletter = true;
    let podaci = [];

    let emailVesti = document.getElementById("newsletterEmail").value.trim();
    let emailVestiPolje = document.getElementById("newsletterEmail");
    
    let reEmail = /^\w([\.-]?\w+\d*)*\@\w+\.\w{2,7}\.\w{2,4}$/
    let emailVestiGreska = document.querySelector(".emailVesti-greska");

    //Validacija email-a
    let isValidEmailVesti = reEmail.test(emailVesti);
    if(isValidEmailVesti){
        emailVestiGreska.textContent = "Hvala vam što ste se pretpltili! Nadamo se da ćete da uživate u nedeljnim vestima...";
        document.getElementById("newsletterEmail").value="";
        podaci.push(emailVesti);
        emailVestiGreska.hide();
    }
    else{ 
        emailVestiGreska.style.display='block';
        validNewsletter = false;
       emailVestiPolje.focus();
    }
    var resetuj = document.getElementById("formaObavestenje");
    resetuj.reset();
}

function proveraKontaktForme(){
    let validFormaKontakt = true;
    let podaci = [];
//polja
    let imePolje, emailPolje, pitanjaPolje;

    imePolje = document.getElementById("name");
    emailPolje = document.getElementById("email");
    pitanjaPolje = document.getElementById("pitanja");

//dohvatanje vrednosti unosa od korisnika
    let imePrezime, email, pitanja;

        imePrezime = document.getElementById("name").value.trim();
        email = document.getElementById("email").value.trim();
        pitanja = document.getElementById("pitanja").value.trim();

//regularni izrazi
let reImePrezime, reEmail, rePitanja;

    /* reImePrezime --> mora da se unesu 2 stavke, bez obzira da li je to ime i prezime, ili pak 2 imena/prezimena, ali mogu da se unesu i više imena/prezimena ukoliko ih neko ima */
        reImePrezime = /^[A-ZŠĐŽČĆ][a-zšđžčć]{2,19}(\s[A-ZŠĐŽČĆ][a-zšđžčć]{2,19})+$/
        reEmail = /^[a-z]{3,}(\.)?[a-z\d]{1,}(\.[a-z0-9]{1,})*\@[a-z]{2,7}\.[a-z]{2,3}(\.[a-z]{2,3})?$/

    /* reImePrezime --> početno veliko slovo, maximalno 200karaktera */
        rePitanja = /^[A-ZZŠĐŽČĆ][a-zšđžčć\.\d\s\-]{0,199}$/

//smestanje greske
    let imePrezimeGreska, emailGreska, pitanjaGreska;

        imePrezimeGreska = document.querySelector("#imeGreska");
        emailGreska = document.querySelector("#emailGreska");
        pitanjaGreska = document.querySelector("#pitanjaGreska")

//Validacija imena
    let isValidIme = reImePrezime.test(imePrezime);
    if(imePrezime!=""){
        if(isValidIme){
            imePrezimeGreska.textContent = "";
            podaci.push(imePrezime);
        }
        else{
            validFormaKontakt = false;
            imePrezimeGreska.textContent = "*Ime ili prezime nije validno --: Min: 3, Max: 15 slova, Početno slovo treba da bude veliko,ako imate više imena/prezimena možete da ih napišete.";
        }
    }
    else{
        imePrezimeGreska.textContent = "Molimo vas da ne ostavljate prazno polje za ime.";
        validFormaKontakt = false;
    }

    //Validacija email-a
    let isValidEmail = reEmail.test(email);

    if(email!=""){
        if(isValidEmail){
            emailGreska.textContent = "";
            podaci.push(email);
        }
        else{
            emailGreska.textContent="*Email adresa nije validna. Mora da bude ispisana malim slovima u formatu poput: nesto@gmail.com ."
            validFormaKontakt = false;
        }
    }
    else{
        emailGreska.textContent = "Molimo vas da ne ostavljate prazno polje za email";
        validFormaKontakt = false;
    }

    //Validacija polja za pitanja
    let isValidPitanja = rePitanja.test(pitanja);

    if(pitanja!=""){
        if(isValidPitanja){
            pitanjaGreska.textContent = "";
            podaci.push(pitanja);
        }
        else{
            validFormaKontakt = false;
            pitanjaGreska.textContent="*Polje za sugestije nije validno - Prvo slovo mora da bude veliko, a nakon njega može bilo šta. Maksimalna dužina karaktera je 200. ."
        }
    }
    else{
        pitanjaGreska.textContent = "Molimo vas da ne ostavljate prazno polje za sugestije.";
        validFormaKontakt = false;
    }

    if(validFormaKontakt){
        document.getElementById("formaKontakt").reset();
        $(this).find("button").addClass("bttn");
        alert("Uspesno poslato!")
    }
    }

  /*------------------
        Plugins:
    1. Letterfx JQuery plugin for typewritting text based on settings
    --------------------*/

    $(document).ready(function(){
        $('#typewriteText').letterfx({
            "fx":"fade",
            "backwards":false,
            "timing":50,
            "fx_duration":"50ms",
            "letter_end":"restore",
            "element_end":"restore"
        });

        /*-----------------
        1. Postavljanje tooltipa na button liste želja
        2. Generisanje trenutne godine i prikaz iste u footer u deo za copyright
        --------------------------*/
        $('[data-toggle="tooltip"]').tooltip();
        var datum = new Date();
        const trenutnaGodina = datum.getFullYear();
        $(".godinaCopyright").html(trenutnaGodina);

    });    
    