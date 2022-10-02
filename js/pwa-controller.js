window.samplePWA = typeof window.samplePWA === 'undefined' ? {} : window.samplePWA;
window.samplePWA.functions = typeof window.samplePWA.functions === 'undefined' ? {} : window.samplePWA.functions;

window.samplePWA.functions.startEnviroment = function startEnviroment() {
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.register('/sw.js')
		.then(reg => console.log('SW: Registered. Scope: ', reg.scope))
		.catch(err => console.warn('SW: Error while registering. Error: ', err))
	}
	let pwa = true;
	if (pwa) {
		window.samplePWA.functions.PWAController();
	}
};
window.samplePWA.functions.PWAController = function PWAController() {
	let deferredPrompt;
	let serverSideHTML = document.getElementById('pwa-install');
	if (!serverSideHTML) {
		let html = `<a id="pwa-btn" href="#pwa-popup" class="btn">Install PWA</a>
		<div id="pwa-popup" class="overlay">
		<a href="#!" class="popup-close" title="Back"></a>
		<div class="popup small-popup">
		<a class="small-close" href="#!" title="Back"></a>
		<h2 class="popup-header">StationMD</h2>
		<div class="popup-content">
		<p id="pwa-message"></p>
		<button class="btn" href="#pwa-popup" id="pwa-install">Try Now</button>
		</div>
		</div>
		</div>`;
		pwaHTML = document.createElement('div');
		pwaHTML.innerHTML = html;
		document.body.appendChild(pwaHTML);
		document.body.querySelector('#pwa-btn').style = 'position: fixed; bottom: 15px; right: 15px; z-index: 9;';
	}
	let installIndicator = document.body.querySelector('#pwa-btn') ?? document.createElement('div');
	let installPopup = document.body.querySelector('#pwa-popup');
	let installMsg = document.body.querySelector('#pwa-message');
	let installBtn = document.body.querySelector('#pwa-install');
	const userAgent = window.navigator.userAgent.toLowerCase();
	const ios = /iphone|ipod|ipad/.test(userAgent);
	const safari = /safari/.test(userAgent);
	if (installBtn) {
		if (ios) {
			if (safari) {
				installMsg.innerHTML = 'To install this pwa on your iphone click <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 640 640"><path fill="currentColor" d="M128 320c0-35.2 28.8-64 64-64h256c35.2 0 64 28.8 64 64v256c0 35.2-28.8 64-64 64h-256c-35.2 0-64-28.8-64-64v-256zM192 320v256h256v-256h-64v-64h-128v64h-64zM288 122.56v389.44h64v-389.44l98.24 98.24 45.44-45.12-175.68-175.68-176 176 45.44 44.8 98.56-97.92z"></path></svg> on safari and choose to add it to the home screen.';
				installBtn.remove();
			} else {
				installMsg.innerHTML = 'Sorry but iphone only supports progressive web apps inside safari browser.';
				installBtn.remove();
			}
		} else {
			installMsg.innerHTML = 'To install this application on to your desktop or laptop device, simply click on the <br><strong> ADD TO HOME SCREEN </strong> button below and then click <strong>Install</strong>.</p>';
		}
		window.addEventListener('beforeinstallprompt', (e) => {
			deferredPrompt = e;
			installIndicator.style.display = 'initial';
			installPopup.style.display = 'block';
			installBtn.style.display = 'initial';
		});
		setTimeout(() => {
			if (!deferredPrompt && !ios) {
				console.log('navigator via setTimeout');
				window.location.replace("https://staging.stationmd.com/zoom-token");
			}
		}, 500);
		installBtn.addEventListener('click', async () => {
			if (deferredPrompt !== null && deferredPrompt !== 'undefined') {
				deferredPrompt.prompt();
				const { outcome } = await deferredPrompt.userChoice;
				if (outcome === 'accepted') {
				console.log('navigator via deferredPrompt');
					window.location.replace("https://staging.stationmd.com/zoom-token");
					deferredPrompt = null;
					installMsg.innerHTML = 'Thank you for installing our pwa.';
					installIndicator.remove();
					installBtn.remove(); 
				}
			}
		});
	}
};
(function () {
	window.samplePWA.functions.startEnviroment();
})();
