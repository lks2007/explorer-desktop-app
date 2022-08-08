import 'core-js/stable';
const runtime = require('@wailsapp/runtime');
import $, { easing } from 'jquery';
window.jQuery = window.$ = $;

// Main entry point
function start() {

	var mystore = runtime.Store.New('Folder');

	// Ensure the default app div is 100% wide/high
	var app = document.getElementById('app');
	app.style.width = '100%';
	app.style.height = '100%';

	// Inject html
	app.innerHTML = `
		<nav>
			<img src="https://lks2007.github.io/img.jpg" class="logo" alt="" srcset="">
			<div class="block active mt-2">
				<i class="fal fa-copy"></i>
			</div>
			<div class="block">
				<i class="fal fa-search"></i>
			</div>
		</nav>
		<div class="explorer">
			<div class="short-block">
				<p class="title">Explorer</p>
				<i class="fal fa-ellipsis-h ft-up btn"></i>
			</div>
			<div class="mini-block" aria-label="0">
				<i class="fal fa-chevron-down down"></i>
				<p class="bold">OPEN EDITORS</p>
			</div>
			<div class="mini-block" aria-label="0">
				<i class="fal fa-chevron-down down"></i>
				<p class="bold exp">EXPLORE-APP</p>
			</div>
			<div class="list">
			</div>
		</div>
	`;

	window.backend.Folder.GetCurrentDir()
	.then( value => {$(".exp").text(value[0])})


	$(".block").click(function() {
		$(".active").removeClass('active')
		$(this).addClass('active')
	})

	var content ="";
	
	function addBlock($taille){
		$("tr").on("click",function(e) {
			var $row = $(this).children("td").eq(0)
			if($row.attr('aria-label') === "dir"){
				window.backend.Folder.GetFolder($(this).children("td")[1].getAttribute("f"))
				.then( value => {
					content = ""
					var i;
					for(i in value);{
						i=i		
					}
					var a = 0;
					
					while(i >= a){
						var icon = String(value[a][1])
						if (icon.includes("<i class='fa-solid fa-folder")){
							content+= "<tr><td class='center t-2' aria-label='dir'>"
						}else{
							content+= "<tr><td class='center t-2'>"
						}
						
						content+=value[a][1]
						content+="</td><td f='"+value[a][0]+"'>"
						content+=value[a][0]
						content+= "</td></tr>"
						
						a++
					}
					$(".list").html(`<table class='sblock'>`+content+"</table>")

					window.backend.Folder.GetCurrentDir()
					.then( value => {$(".exp").text(value[0])})

					
					$("tbody").css({"height": $taille})

					addBlock($taille)
				})
			}else{
				
			}
		})
	}

	$(".mini-block").click(function(){
		if (($(this).attr("aria-label") === "0") || ($(this).attr("aria-label") === "2")){
			$(this).children(".down").addClass("down-activate")
			if ($(this).attr("aria-label") === "0"){
				window.backend.Folder.GetFolder(".")
				.then( value => { 
					var i;
					for(i in value);{
						i=i					
					}
					var a = 0;
					while(i >= a){
						var icon = String(value[a][1])
						if (icon.includes("<i class='fa-solid fa-folder")){
							content+= "<tr><td class='center t-2' aria-label='dir'>"
						}else{
							content+= "<tr><td class='center t-2'>"
						}
						content+=value[a][1]
						content+="</td><td f='"+value[a][0]+"'>"
						content+=value[a][0]
						content+= "</td></tr>"
						
						a++
					}
					$(".list").html(`<table class='sblock'>`+content+"</table>")
					
					window.backend.Folder.GetCurrentDir()
					.then( value => {$(".exp").text(value[0])})

					var $taille = $("#app").height()-$(".mini-block").eq(0).height()-$(".mini-block").eq(1).height()-$(".short-block").height()-23
					console.log($taille)
					$("tbody").css({"height": $taille})

					addBlock($taille)
			
				})
			
			}
			$(this).attr("aria-label", "1")
			$(".list").slideDown(300)
		}else{
			$(this).children(".down").removeClass("down-activate")
			$(this).attr("aria-label", "2")
			$(".list").slideUp(300)
		}
	})
	// <button onClick='window.backend.Counter.Increment()'>
	// 	Increment Counter
	// </button>
	// <button onClick='window.backend.Counter.Decrement()'>
	// 	Decrement Counter
	// 	</button>
	// </div>
	// <div class='result'>Counter: <span id='counter'></span></div>
	// <div class='container'>
	// 	<input id='newCounter' type="number" value="0"/>
	// 	<button id='setvalue'>Set Counter Value</button>
	// 	<button onclick='window.backend.Counter.RandomValue()'>Set to Random Value</button>
	// </div>
	// `;

	// Connect counter value button to Go method
	// document.getElementById('setvalue').onclick = function() {
	// 	let newValue = parseInt(document.getElementById('newCounter').value,10);
	// 	mystore.set(newValue);
	// };

	// mystore.subscribe( function(state) {
	// 	document.getElementById('counter').innerText = state;
	// });
	
	// mystore.set(0);
};

// We provide our entrypoint as a callback for runtime.Init
runtime.Init(start);