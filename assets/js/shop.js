$(document).ready(() => {
    console.log("Shop");

    /*** Dinamicki ispis DropDown liste za sortiranje i upis u div#sort --> IFFE funkcija ***/
    (function prikaziDdl(){
        let ispisDdl = ` <option value="0" selected>Sortiraj po:</option>`;
        const ddl = [
            {
                value:"priceUp",
                vrednosti:"Cena rastuće",
                kriterijum:"price",
                redosled: "asc"
            },
            {
                value:"priceDown",
                vrednosti:"Cena opadajuće",
                kriterijum:"price",
                redosled: "desc"
            },
            {
                value:"nameAZ",
                vrednosti:"Naziv A-Z",
                kriterijum:"name",
                redosled: "asc"
            },
            {
                value:"nameZA",
                vrednosti:"Naziv Z-A",
                kriterijum:"name",
                redosled: "desc"
            },
            {
                value:"recent",
                vrednosti:"Najnoviji",
                kriterijum:"recent",
                redosled: "desc"
            }
        ]
        for(const i of ddl){
            ispisDdl += `<option class="sort" value="${i.value}" data-kriterijum="${i.kriterijum}" data-redosled="${i.redosled}" >${i.vrednosti}</option>`;
        }
        $("#sort").html(ispisDdl);
    })();

    prikaziProizvode();
    prikaziKategorije();
    prikaziKategorijeZaMobilne();
    prikaziBrendove();
    prikaziBrendoveZaMobilne();
    /**** Prikaz po trokolumnoj i cetvorokolumnoj strukturi ****/
	$('.viewMode .active a').on('click',function() {
		if ($(this).hasClass('tri')) {
            $(".proizvod").css("flex-basis", "35%")					
		}
		else if($(this).hasClass('cetiri')) {
            $(".proizvod").css("flex-basis", "20%")									
		}
	});

    /**** ES6 - dodeljivanja alijasa i dogadjajii ****/
    const s = selektor => document.querySelector(selektor);
    EventTarget.prototype.on = EventTarget.prototype.addEventListener;
    s('#pretraga').on('keyup',filtrirajPoNazivu);
    s('#pretragaMob').on('keyup',filtrirajPoNazivuMob);

/** FILTER PO POLU ***/
    $("#pol").find("input[name='rbPol']").click(filtrirajPol);
    function filtrirajPol(){
        let val = this.value;
        $.ajax({
            url:"assets/data/products.json",
            dataType:"json",
            method:"get",
            success:function(data){
                var filtritaniNiz = data.filter(fn=> {
                    if(fn.pol == val)
                        return true;
                    });
                    console.log(filtritaniNiz);
                ispisiProizvode(filtritaniNiz);
                ispisModala(filtritaniNiz);
                wishlistProizvodi(filtritaniNiz);
            }
        })
    }

    const slider = document.getElementById("rangePrice");
    slider.addEventListener('input', izmeniOutput);
    slider.addEventListener('change', filtrirajCenu);

    /** otvaranje linka u novom prozoru */
    document.getElementById("otvoriNoviTab").addEventListener("click", function(){
        window.open("https://tomicanja-portfolio.netlify.com/", "_blank");
    });
})

/** Pravljenje jedne f-je koja ce dohvatiti sve proivode iz JSON-a products.json i posle se ova f-ja poziva svaki put kad nam trebaju podaci iz pomenutog fajla **/
function ajaxProizvodi(successFunkcijaProizvodi){
    $.ajax({
        url:"assets/data/products.json",
        method:"get",
        dataType:"json",
        success: successFunkcijaProizvodi
    });
}
function ajaxKategorije(successFunkcijaKategorije){
    $.ajax({
        url:"assets/data/categories.json",
        method:"get",
        dataType:"json",
        success: successFunkcijaKategorije
    });
}
function ajaxBrendovi(successFunkcijaBrendovi){
    $.ajax({
        url:"assets/data/brends.json",
        method:"get",
        dataType:"json",
        success: successFunkcijaBrendovi
    });
}
/*** PRIKAZ PROIZVODA ***/
function prikaziProizvode(){
    ajaxProizvodi(proizvodi => {
        ispisiProizvode(proizvodi);
        ispisModala(proizvodi);
        wishlistProizvodi(proizvodi);
    });
}

/****************** DOHVATANJE PROIZVODA NA KOJI JE KLIKNUTO DA SE SVIDJA KORISNIKU I UPIS U LOCAL STORAGE ******************/
function wishlistProizvodi(proizvodi){
    const btnWishlist = $(".add-to-wishlist");
    console.log(btnWishlist);
    for(var btn of btnWishlist){
        btn.addEventListener("click", addToWishlist);
    }
    function addToWishlist(){
        var id = $(this).data("idomiljeno");;
        console.log(id);
        
        alert("Drago nam je da Vam se sviđa ovaj proizvod!");
        alert("Sve proizvode koje budete sačuvali biće vam u listi želja...");

    var nizOmiljenih = [];

    var omiljeniProizvodi = dohvatiProizvodeIzWishlist();
    console.log(omiljeniProizvodi);
    console.log(nizOmiljenih);


    /*** proveravamo da sta ako je broj proizvoda null */
    if(omiljeniProizvodi !== null){
        if(omiljeniProizvodi.filter(item => item.id == id).length){
            console.log("ima");
            let omiljeniProizvodi = dohvatiProizvodeIzWishlist();
            for(let brojac of omiljeniProizvodi){
                if(brojac.id == id){
                    brojac.kolicina++;
                    break;
                }
            }
            postaviProizvodeUWishlist(omiljeniProizvodi);
        }
        else{
            for(let omiljeni of omiljeniProizvodi){
                nizOmiljenih.push(omiljeni);
            }
            let novi = proizvodi.find(proizvod => proizvod.id == id);
            nizOmiljenih.push({
                id:novi.id,
                kolicina: 1
            });
            postaviProizvodeUWishlist(nizOmiljenih);
        }
    }else{
        /* ES6 - arrow operator */
        let novi = proizvodi.find(p => p.id == id);
        nizOmiljenih[0] = {
            id: novi.id,
            kolicina: 1
        };
        postaviProizvodeUWishlist(nizOmiljenih);
    }
    console.log(omiljeniProizvodi);
    console.log(nizOmiljenih);

    function dohvatiProizvodeIzWishlist(){
        return JSON.parse(localStorage.getItem('proizvodi'));
    }
    function postaviProizvodeUWishlist(value){
        return localStorage.setItem('proizvodi', JSON.stringify(value));
    }
}

}
/******************end  WISHLIST ******************/

/*** Dohvatanje proizvoda i posle ispis ; Ukoluko nema trazenog/ih proizvoda ispisace se obavestenje korisniku da trazenog proizvoda trenutno nema */
 function ispisiProizvode(proizvodi){
     var containerProizvodi =  document.querySelector("#proizvodi");
     let ispisProizvoda = "";
     
     var nizVrednosti = Object.values(proizvodi);
     console.log(nizVrednosti);
     let i=1;
     if(proizvodi.length > 0){
       
         for(const proizvod of nizVrednosti){
            
            ispisProizvoda += 
            `
            <article class="proizvod col-xl-3 col-lg-4 col-md-6 col-sm-12 artikal-items">
            <div class="image">
            <a href="#" rel="proizvodiSlika">
                 <img src="${proizvod.slika.putanja}" alt="${proizvod.slika.putanja}" class="img-fluid product" />
            </a>
                <div class="overImage">
                    <button class="view" data-id="${proizvod.id}" data-toggle="modal" data-target="#exampleModal${i}" data-whatever="view">
                        Quick view
                    </button>
                </div>
            </div>
            <div class="tekstProizvod">
                <h2>${proizvod.naziv}</h2>
                <h2>${naStanju(proizvod.naStanju)}</h2>
                <p class="rating">
                    ${prikaziRating(proizvod.zvezdice) }
                </p> 
                <div class="info-product-price my-2">
                    <span class="item_price text-dark font-weight-bold">${proizvod.cena.snizeno}RSD</span>
                    <sup><del>${proizvod.cena.original}RSD</del></sup>
                </div>
                <div class="snipcart-details top_brand_home_details item_add single-item hvr-outline-out">
                    <input type="button" title="dodaj u listu želja" data-toggle="tooltip" data-placement="bottom" value="Dodaj u omiljene" class="button btn add-to-wishlist"  data-idomiljeno="${proizvod.id}" />
                </div>
            </div>
        </article> 
            `
            i++;
         }   
     }
     else{
        ispisProizvoda += `<h2 class="text-center blok-1 text-black">Žao nam je, ne možemo naći ni jedan rezultat!</h2>`;
     }
     containerProizvodi.innerHTML = ispisProizvoda;
 }

function prikaziKategorije(){
    ajaxKategorije(kategorije => {
        ispisiKategorije(kategorije);
    });
}

/****** ispisivanje kategorija  ****/
function ispisiKategorije(kategorije){
    let ispisKategorija = "<ul>";
    kategorije.forEach(kategorija=>{
        ispisKategorija += 
        `
            <li>
                <a href="#" data-idkat="${kategorija.id}">${kategorija.naziv}</a>
            </li>
        `
    })
    ispisKategorija += "</ul>";
    $("#kategorije").html(ispisKategorija);
    $('#kategorije ul li a').click(filtrirajPoKategoriji);
}

function filtrirajPoKategoriji(e){
    e.preventDefault();

    let idKategorije = $(this).data('idkat');
    $.ajax({
        url: "assets/data/products.json",
        method: "GET",
        success: function(proizvodi){
            proizvodi = filterPoKategoriji(proizvodi, idKategorije);
            console.log(proizvodi);
            ispisiProizvode(proizvodi);
            ispisModala(proizvodi);
            wishlistProizvodi(proizvodi);
        }
    });
}

function filterPoKategoriji(proizvodi, idKategorije){
    return proizvodi.filter(x => x.kategorije.idKategorije == idKategorije);
}

/**** Za mobilnee *****/
function prikaziKategorijeZaMobilne(){
    ajaxKategorije((kategorije) => {
        console.log(kategorije);
        ispisiKategorijeZaMobilne(kategorije);
    });
}
/****** ispisivanje kategorija za mobilne uredjaje ****/
function ispisiKategorijeZaMobilne(kategorije){
    let ispisKategorija = `<option value="0">Izaberite kategoriju</option> `;
    kategorije.forEach(kategorija=>{
        ispisKategorija += 
        `
        <option value="${kategorija.id}" data-idkat="${kategorija.id}">${kategorija.naziv}</option> 
        
        `
    })
    $("#kategorijeMob").html(ispisKategorija);
    $('#kategorijeMob').change(filtrirajPoKategorijiMob);
}

function filtrirajPoKategorijiMob(){
    let element = $(this).val();
    console.log(element);
    ajaxProizvodi(proizvodi => {
        proizvodi = filterPoKategorijiMob(proizvodi, element);
        console.log(proizvodi);
        ispisiProizvode(proizvodi);
        ispisModala(proizvodi);
        wishlistProizvodi(proizvodi);
    })
}
function filterPoKategorijiMob(proizvodi, element){
    return proizvodi.filter(x => x.kategorije.idKategorije == element);
}

/** sortiranje proizvoda po raznim kriterijumima - cenaRastuce, cenaOpadajuce, po nazivu A-Z, po nazivu Z-A,... */
    $(document).on("change", "#sort", sortirajProizvode);
    function sortirajProizvode(){
        var kriterijumZaSortiranje = $(this).val();
        ajaxProizvodi(proizvodi => {
            console.log(proizvodi);
               let nizProizvoda = proizvodi;
               if(kriterijumZaSortiranje == 'priceUp')
                {
                    nizProizvoda = proizvodi.sort((a, b) => {
                        return a.cena.snizeno - b.cena.snizeno;
                    });
                }
                else if(kriterijumZaSortiranje == 'priceDown')
                {
                    nizProizvoda = proizvodi.sort((a, b) => {
                        return b.cena.snizeno - a.cena.snizeno;
                    });
                }
                else if(kriterijumZaSortiranje == 'nameAZ'){
                    proizvodi.sort(function(a, b){ 
                        if(a.naziv > b.naziv) return 1;
                        else if(b.naziv < a.naziv) return -1;
                        else return 0;
                    })
                }
                else if(kriterijumZaSortiranje == 'nameZA'){
                    proizvodi.sort(function(a, b){ 
                        if(a.naziv > b.naziv) return -1;
                        else if(b.naziv < a.naziv) return 1;
                        else return 0;
                    })
                }
                else if(kriterijumZaSortiranje == 'recent'){
                    proizvodi.sort(function(a, b){ 
                        return new Date(b.datumUnosa) - new Date(a.datumUnosa);
                    })
                    
                }
                ispisiProizvode(nizProizvoda);
                ispisModala(nizProizvoda);
            wishlistProizvodi(proizvodi);
        });
    }

function prikaziBrendove(){
    $.ajax({
        url:"assets/data/brends.json",
        dataType:"json",
        method:"get",
        success:function(data){
            prikazBrenda(data);
        }
    })
}
/******** BRENDOVI ******/
function prikazBrenda(data){
    let ispis="<ul>";
    data.forEach(element => {
        ispis +=
        `
        <li>
            <a href="#" data-idbrend="${element.id}">${element.naziv}</a>
        </li>
    `
    });
    ispis += "</ul>";
    $("#brendovi").html(ispis);
    $('#brendovi li a').click(filtrirajPoBrendu);
    
}

function filtrirajPoBrendu(e){
    e.preventDefault();

    let brendId = $(this).data('idbrend');
    $.ajax({
        url: "assets/data/products.json",
        method: "GET",
        success: function(proizvodi){
            
            proizvodi = filterPoBrendu(proizvodi, brendId);
            ispisiProizvode(proizvodi);
            ispisModala(proizvodi)
            wishlistProizvodi(proizvodi);
        }
    });
}
function filterPoBrendu(proizvodi, brendId){
    return proizvodi.filter(x => x.brend.id == brendId);
}

/**** Za mobilnee *****/
function prikaziBrendoveZaMobilne(){
    ajaxBrendovi(brendovi => {
        ispisiBrendoveZaMobilne(brendovi);
    });
}
function ispisiBrendoveZaMobilne(data){
    let ispis=`<option value="0">Izaberite brend...</option>`;
    data.forEach(element => {
        ispis +=
        `
        <option value="${element.id}" data-idbrend="${element.id}">${element.naziv}</option> 
        `
    });
    $("#brendoviMob").html(ispis);
    $('#brendoviMob').change(filtrirajPoBrenduMob);
}

function filtrirajPoBrenduMob(){
    let element = $(this).val();
    console.log(element);
    ajaxProizvodi(proizvodi => {
        proizvodi = filterPoBrenduMob(proizvodi, element);
        console.log(proizvodi);
        ispisiProizvode(proizvodi);
        ispisModala(proizvodi);
        wishlistProizvodi(proizvodi);
    })
}
function filterPoBrenduMob(proizvodi, element){
    return proizvodi.filter(x => x.brend.id == element);
}

/*** PRETRAGA PROIZVODA PO NAZIVU****/
function filtrirajPoNazivu(){
    let val = this.value;
   console.log("radi search");
    ajaxProizvodi(proizvodi => {
        proizvodi=proizvodi.filter(p=>{
            if(p.naziv.toUpperCase().indexOf(val.toUpperCase())!=-1){
                return true;
            }
        })
        console.log(proizvodi)
        ispisiProizvode(proizvodi);
        ispisModala(proizvodi);
        wishlistProizvodi(proizvodi);
    });
}
function filtrirajPoNazivuMob(){
    let val = this.value;
   console.log("radi search");
    ajaxProizvodi(proizvodi => {
        proizvodi=proizvodi.filter(p=>{
            if(p.naziv.toUpperCase().indexOf(val.toUpperCase())!=-1){
                return true;
            }
        })
        console.log(proizvodi)
        ispisiProizvode(proizvodi);
        ispisModala(proizvodi);
        wishlistProizvodi(proizvodi);
    });
}

/*** PRICE RANGE SLIDER ---> promenom pokazivaca prikazuju se proizvodi manji ili jednaki ceni koja je podesena na njemu***/
function izmeniOutput() {
    var sliderValue = this.value;
    var output = document.getElementById("demo");
    output.textContent = sliderValue;
}
function filtrirajCenu() {
        ajaxProizvodi((proizvodi) => {
            var cena = document.getElementById("rangePrice").value;
            proizvodi=returnFiltriranuCenu(proizvodi,cena);
            ispisiProizvode(proizvodi);
            ispisModala(proizvodi);
            wishlistProizvodi(proizvodi);
        });       
}
function returnFiltriranuCenu(proizvodi,cena){
    return proizvodi.filter(item => {
        if (item.cena.snizeno <= cena) {
            return item;
        }
    });
    
}

/**** PRIKAZ MODALA NA KLIK ODREĐENOG PROIZVODA */
function ispisModala(proizvodi) {
    let ispis = ``;
    let i = 1;
    for (let p of proizvodi) {
        ispis += 
        `
        <div class="modal fade" id="exampleModal${i}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    <figure>
                        <img src="${p.slika.putanja}" alt="${p.slika.alt}" class="img-fluid"/>
                    </figure>
                    <div class="modal-header">
                        <h3 class="modal-title">${p.naziv}</h3>
                        
                        <p>${p.opis}</p>
                        <div class="price my-2">
                            <span class="item_price text-dark font-weight-bold">${p.cena.snizeno}RSD</span>
                            <sup><del>${p.cena.original}RSD</del></sup>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btnModal btn-secondary" data-dismiss="modal">Nazad</button>
                            <button type="button" title="dodaj u listu želja" data-toggle="tooltip" data-placement="bottom" value="Dodaj u omiljene" class="btnModal btn-secondary  add-to-wishlist"  data-idomiljeno="${p.id}">
                                Dodaj u omiljeno
                            </button>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>`;
        i++;
    }
    $("#modaliProizvoda").html(ispis);
    $('#exampleModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget)
        var recipient = button.data('whatever') 
        var modal = $(this);
        modal.show();
      })
    $('#exampleModal').on('hide.bs.modal', function (event) {
        var button = $(event.relatedTarget) 
        var recipient = button.data('id') 
        var modal = $(this)
        modal.hide();
      })
   }

   /** PROVERA DA LI JE PROIZVOD NA STANJU */
function naStanju(naStanju){
    if(naStanju)
        return "Na stanju";
    return "<del>Nije na stanju</del>";
}
  
/** ISPIS RATING-A TJ ZVEZDICA ISPOD SVAKOG PROIZVODA */
function prikaziRating(unetBrojZvezdica){
    let ispisZvezdica = "";
    const ukBrZvezdica = 5;
    for(let i=1;i<=ukBrZvezdica;i++){
        if(i<= unetBrojZvezdica){
            ispisZvezdica += "<i class='fas fa-star'></i>"
        }  else{
            ispisZvezdica += "<i class='far fa-star'></i>"
        }
    }
    return ispisZvezdica;
}