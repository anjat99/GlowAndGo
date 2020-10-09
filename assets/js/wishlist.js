/** korišćenje arrow operatora **/
$(document).ready(()=>{
    var omiljeniProizvodi = dohvatiProizvodeIzWishlist();
    if(omiljeniProizvodi.length){
        ispisiPodatakaUWishlist();
    }else{
        ispisiObavestenje();
    }
})

/* ------------- dohvatamo podatke iz LocalStorage-a i nakon toga upisujemo na stranicu za omiljene proizvode, u ovom slucaju u formi tabele, gde mozemo da vidimo ID, sliku izabranog proizvoda, naziv, kao i cenu istog. U poslednjoj koloni imamo opciju da izbrisemo datim proizvod ukoliko nam se u medjuvremenu vise ne svidja ------------*/
function ispisiPodatakaUWishlist(){
    var omiljeniProizvodi = dohvatiProizvodeIzWishlist();
    $.ajax({
        url: "assets/data/products.json",
        method:"get",
        dataType: "json",
        success: function(items){
            items = items.filter(item => {
                for(let omiljeni of omiljeniProizvodi){
                    if(item.id == omiljeni.id){
                        item.kolicina == omiljeni.kolicina
                        return 1;
                    }
                }
                return 0;
            });
            ispisPodatkeUTabelu(items);
        },
        error: function(xhr, status, greska){
            console.log(status + " - " + greska);
        }
    });
}

function ispisPodatkeUTabelu(items){
        let ispisProizvodaUWishlist = " ";
        for(let item of items){
            ispisProizvodaUWishlist += 
            `
                <tr">
                    <th scope="row">
                        ${item.id}
                    </th>
                    <td class=""slikaWishList>
                        <img src="${item.thumbnail.putanja}" alt="${item.thumbnail.alt}"  class="img-fluid"/>
                    </td>
                    <td>
                        <h2>${item.naziv}</h2>
                    </td>
                    <td>
                        <h2>${item.cena.snizeno}din.</h2>
                    </td>
                    <td>
                        <p data-id=" ${item.id}" class="remove" title="remove">
                                <i class="fas fa-edit"></i>
                        </p> 
                    </td>
                </tr>
            `;
        };
        $("#upisOmiljenih").html(ispisProizvodaUWishlist);
        $(".remove").on("click", ukloni);
    }

/**** uklanjanje proizvoda iz wishlist */
function ukloni(id){
    var id = $(this).data("id");
    console.log(id);

    var omiljeniProizvodi = dohvatiProizvodeIzWishlist();
    /** ES6 => korišćenje arrow operatora */
    let filtriraniProizvodi = omiljeniProizvodi.filter(p => p.id != id);

    postaviProizvodeWishlist(filtriraniProizvodi)
    ispisiPodatakaUWishlist();
}

function dohvatiProizvodeIzWishlist(){
    return JSON.parse(localStorage.getItem('proizvodi'));
}
function ispisiObavestenje(){
    $("#sadrzajWishlist").html("<h2>Sorry, you didn't choose any product...</h1>")
}
function postaviProizvodeWishlist(value){
    return localStorage.setItem('proizvodi', JSON.stringify(value));
}