//inserting the API KEY

$(document).ready(() => {


let myCrypto;

function keyInsert() {
  $(".loadup").show();
  clearInterval(myCrypto);
  $.ajax({
  url: "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc",
  type: "GET",
  dataType:"JSON",
  success: function (results) {
    $(".loadup").hide();

    for (var i = 0; i < 100; i++) {
     cardFunc(results[i]);
     moreInfoFunc(results[i].id);
     }
    doubleCheckToggle();
    },

   error: function (results) {
   console.log(`Error: "  ${results}`);
   }

});
};

keyInsert();

//cards - to show crypto currency (coin) data
function cardFunc(card) {

   $('#maincontainer').append(
     `<div class="col-sm-4"  id="${card.symbol.toUpperCase()}" >
      <div class="card">
      <div class="card-body">
      <label class="switch">
       <input type="checkbox" class="checkboxes" onchange="toggleFunc(this,'${card.symbol.toUpperCase()}')" id="check${card.symbol.toUpperCase()}"> <span class="slider round" id=""></span>
      </label>
      <h5 id="${card.symbol.toUpperCase()}a1" class="card-title">${card.symbol.toUpperCase()}</h5>
      <p class="card-text">${card.name}</p>
      <button class="btn" id="moreinfobutton${card.id}" type="button"  data-toggle="collapse" data-target="#open${card.id}" aria-expanded="false" aria-controls="collapseExample">
       More Info
      </button>
      <div class="collapse" id="open${card.id}">
      <div class="card card-body" id="${card.id}">

      </div>
      </div>
      </div>
      </div>
      </div>`
    );

    };

//onclick function for "moreinfo" button calling additional info 

function moreInfoFunc(idCoin) {
  $(`#moreinfobutton${idCoin}`).on("click", function () {
  $(".loadup").show();
  let idCoin = $(this).next().children().attr("id")
  let timeNow = Date.now();
  let backUpCoin = JSON.parse(localStorage.getItem(idCoin));

  if (backUpCoin != null && (timeNow - backUpCoin.time) < 120000) {
   console.log("from local");
   $(".loadup").hide();
   $(`#${idCoin}.card`).html(`
   <div><img src=${backUpCoin.image.small}/></div><br>
   <div>$ ${backUpCoin.market_data.current_price.usd.toFixed(4)}</div>
   <div>€ ${backUpCoin.market_data.current_price.eur.toFixed(4)}</div>
   <div>₪ ${backUpCoin.market_data.current_price.ils.toFixed(4)}</div>
`)
 } else {
  console.log("from Ajax");
  $.ajax({
   type: "GET",
   url: `https://api.coingecko.com/api/v3/coins/${idCoin}`,
   dataType:"JSON",
   beforeSend: function () {
    $(".loadup").show();
 },
   success: function (results) {
   $(".loadup").hide();

    $(`#${idCoin}.card`).html(`
    <div><img src=${results.image.small}/></div><br>
    <div>$ ${results.market_data.current_price.usd.toFixed(4)}</div>
    <div>€ ${results.market_data.current_price.eur.toFixed(4)}</div>
    <div>₪ ${results.market_data.current_price.ils.toFixed(4)}</div>
`)

    results.time = Date.now();
    localStorage.setItem(`${results.id}`, JSON.stringify(results));
  }
});
};


});
};

//search functionality

$('#search-input').on('keypress', function (e) {
 var key = String.fromCharCode(!e.charCode ? e.which : e.charCode);
 if (!/^[A-Z0-9]+$/i.test(key)) {
  event.preventDefault();
}
});

$("#search-btn").on("click", function () {
 clearInterval(myCrypto);
 var val = $(this.previousElementSibling).val().toUpperCase();



if ($("#" + val + "a1").offset() !== undefined && val !== undefined) {

 $(".col-sm-4").each(function () {
 let cardText = $(this).attr("id").toUpperCase();
if (cardText === val) {
 $(this).show();
 } else {
  $(this).hide();
};

});
}

// if search input is empty
else if (val == "") {
$("#searchmsg").html("Please enter a valid coin name to search.");
setTimeout(function () {
$("#searchmsg").html("");
}, 5000);
}

//if typed in wrong coin name
else {
$("#searchmsg").html("Could not find a matching coin");
allcards.show();
setTimeout(function () {
$("#").html("");
}, 5000);
}
$("#search-input").val("");
});



});





//toggle functionality

var selectedCoins = [];

var selectedToggleIds = [];

var graphdata = [];
var updater;

function toggleFunc(currenttoggle, coinname) {

var ToggleId = currenttoggle.id;

let indexSymbolCoin = selectedCoins.indexOf(coinname);
let indexIdToggleLive = selectedToggleIds.indexOf(ToggleId);

if (indexSymbolCoin != -1) {
selectedCoins.splice(indexSymbolCoin, 1);
updateCoinSpan();
selectedToggleIds.splice(indexIdToggleLive, 1);
} else {

if (selectedCoins.length < 5) {
selectedCoins.push(coinname);
updateCoinSpan();
selectedToggleIds.push(ToggleId);
} else {

$("#modalbody").empty();
$(`#${ToggleId}`).prop('checked', false);

$("#modalbody").html('To add the "<b>' + coinname + '</b>" coin, you must unselect one of the following: <br>');
$("#mymodal").css("display", "block");

$("#keepcurrent").on("click", () => {
$("#mymodal").css("display", "none");
});

let counterId = 1;

for (let i = 0; i < selectedCoins.length; i++) {

$("#modalbody").append(
`<div id="modaldiv">
<div class="card" id="modalcard">
<div class="card-body" id="modalcardbody">
<h6 id="modalcoinname" class="card-title">${selectedCoins[i]}</h6>
</div>

</div>
<label class="switch" id="modalswitch">
<input type="checkbox" class="checkboxes" id="chosenToggle${counterId}"> <span class="slider round" id="modalslider"></span>
</label>
</div>
</div>
`
);


$(`#chosenToggle${counterId}`).prop('checked', true);

$(`#chosenToggle${counterId}`).on("change", () => {

let indexCoinRemove = selectedCoins.indexOf(selectedCoins[i]);

let ToggleTofalse = selectedToggleIds[indexCoinRemove];

selectedCoins.splice(indexCoinRemove, 1);
updateCoinSpan();
selectedToggleIds.splice(indexCoinRemove, 1);

selectedCoins.push(coinname);
updateCoinSpan();
selectedToggleIds.push(ToggleId);

$("#mymodal").css("display", "none");

$(`#${ToggleTofalse}`).prop('checked', false);
doubleCheckToggle()
})

counterId++;
}

}

console.log(selectedCoins);
console.log(selectedToggleIds);


}

}


function updateCoinSpan() {
var coinspandata = "";
for (var i = 0; i < selectedCoins.length; i++) {
if (i == (selectedCoins.length - 1)) {
coinspandata += selectedCoins[i];
}
else {
coinspandata += selectedCoins[i] + ", ";
}
}
$("#selectedcoins").html(coinspandata);
};

function doubleCheckToggle() {

for (let i = 0; i < selectedToggleIds.length; i++) {

$(`#${selectedToggleIds[i]}`).prop('checked', true);

}

};