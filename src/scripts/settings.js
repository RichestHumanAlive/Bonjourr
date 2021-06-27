function signature() {
	let v = "<a href='https://victr.me/'>Victor Azevedo</a>"
	let t = "<a href='https://tahoe.be'>Tahoe Beetschen</a>"
	let e = document.createElement('span')

	e.innerHTML = Math.random() > 0.5 ? ` ${v} & ${t}` : ` ${t} & ${v}`
	id('rand').appendChild(e)
}

function changeCustomFreq(val) {
	chrome.storage.sync.set({ custom_every: val })
}

function selectBackgroundType(cat) {
	id('dynamic').style.display = 'none'
	id('custom').style.display = 'none'
	id(cat).style.display = 'block'

	// Applying functions
	cat === 'custom' ? localBackgrounds(null, true) : unsplash()

	// Setting frequence
	chrome.storage.sync.get(['custom_every', 'dynamic'], (data) => {
		const c_every = data.custom_every || 'pause'
		const d_every = data.dynamic.every || 'hour'

		id('i_freq').value = cat === 'custom' ? c_every : d_every
	})

	chrome.storage.sync.set({ background_type: cat })
}

function showall(that) {
	const change = (ev) => {
		for (let dom of cl('pro')) {
			if (ev) dom.classList.add('shown')
			else dom.classList.remove('shown')
		}
	}

	const addtransitions = (dom, css) => {
		for (let d of cl(dom)) d.style.transition = css
	}

	//event
	if (that !== undefined) {
		change(that)
		chrome.storage.sync.set({ showall: that })

		//init
	} else {
		const data = JSON.parse(localEnc(disposableData, false))
		change(data.showall)

		//add transitions
		addtransitions('pro', 'max-height .2s')
	}
}

function toggleClockOptions(analog) {
	const optionsWrapper = id('clockoptions')
	if (analog) {
		optionsWrapper.classList.remove('digital')
		optionsWrapper.classList.add('analog')
	} else {
		optionsWrapper.classList.remove('analog')
		optionsWrapper.classList.add('digital')
	}
}

function settingsEvents() {
	// file input animation
	const custom = id('i_bgfile')
	const customStyle = id('fileContainer')

	custom.addEventListener('dragenter', function () {
		customStyle.classList.add('dragover')
	})

	custom.addEventListener('dragleave', function () {
		customStyle.classList.remove('dragover')
	})

	custom.addEventListener('drop', function () {
		customStyle.classList.remove('dragover')
	})

	//general

	id('i_showall').onchange = function () {
		showall(this.checked)
	}

	id('i_lang').onchange = function () {
		chrome.storage.sync.set({ lang: this.value })

		//session pour le weather
		sessionStorage.lang = this.value
		if (sessionStorage.lang) location.reload()
	}

	//quick links
	id('i_title').onkeypress = function (e) {
		if (e.code === 'Enter') quickLinks('input', e)
	}

	id('i_url').onkeypress = function (e) {
		if (e.code === 'Enter') quickLinks('input', e)
	}

	id('submitlink').onmouseup = function () {
		quickLinks('button', this)
	}

	id('i_linknewtab').onchange = function () {
		quickLinks('linknewtab', this)
	}

	//visuals
	id('i_type').onchange = function () {
		selectBackgroundType(this.value)
	}

	id('i_freq').onchange = function () {
		if (id('i_type').value === 'custom') changeCustomFreq(this.value)
		else unsplash(null, { every: this.value })
	}

	id('i_collection').onchange = function () {
		unsplash(null, { collection: this.value })
		this.blur()
	}

	//custom bg

	id('i_bgfile').onchange = function () {
		localBackgrounds(null, null, this.files[0])
	}

	id('i_blur').oninput = function () {
		filter('blur', this.value)
		slowRange({ background_blur: parseFloat(this.value) })
	}

	id('i_bright').oninput = function () {
		filter('bright', this.value)
		slowRange({ background_bright: parseFloat(this.value) })
	}

	id('i_dark').onchange = function () {
		darkmode(this.value)
	}

	//Time and date

	id('i_analog').onchange = function () {
		newClock({ param: 'analog', value: this.checked })
		toggleClockOptions(this.checked)
	}

	id('i_seconds').onchange = function () {
		newClock({ param: 'seconds', value: this.checked })
	}

	id('i_clockface').onchange = function () {
		newClock({ param: 'face', value: this.value })
	}

	id('i_ampm').onchange = function () {
		newClock({ param: 'ampm', value: this.checked })
	}

	id('i_timezone').onchange = function () {
		newClock({ param: 'timezone', value: this.value })
	}

	id('i_usdate').onchange = function () {
		date(true, this.checked)
	}

	//weather

	id('i_city').onkeypress = function (e) {
		if (!stillActive && e.code === 'Enter') weather('city', this)
	}

	id('i_units').onchange = function () {
		if (!stillActive) weather('units', this)
	}

	id('i_geol').onchange = function () {
		if (!stillActive) weather('geol', this)
	}

	//searchbar
	id('i_sb').onchange = function () {
		id('searchbar_options').classList.toggle('shown')
		if (!stillActive) searchbar('searchbar', this)
		slow(this)
	}

	id('i_sbengine').onchange = function () {
		searchbar('engine', this)
	}

	id('i_sbnewtab').onchange = function () {
		searchbar('newtab', this)
	}

	//settings

	id('submitReset').onclick = function () {
		importExport('reset')
	}

	id('submitExport').onclick = function () {
		importExport('exp', true)
	}

	id('submitImport').onclick = function () {
		importExport('imp', true)
	}

	id('i_import').onkeypress = function (e) {
		if (e.code === 'Enter') importExport('imp', true)
	}

	id('i_export').onfocus = function () {
		importExport('exp')
	}

	id('i_customfont').onchange = function () {
		customFont(null, { family: this.value })
	}

	id('i_weight').oninput = function () {
		customFont(null, { weight: this.value })
	}

	id('i_size').oninput = function () {
		customSize(null, this.value)
	}

	id('i_row').oninput = function () {
		linksrow(null, this.value)
	}

	id('i_greeting').onkeyup = function () {
		greetingName(null, this.value)
	}

	id('cssEditor').addEventListener('keydown', function (e) {
		if (e.code === 'Tab') {
			e.preventDefault()
		}
	})

	id('cssEditor').addEventListener('keyup', function (e) {
		customCss(null, { e: e, that: this })
	})

	id('hideelem')
		.querySelectorAll('button')
		.forEach((elem) => {
			elem.onmouseup = function () {
				elem.classList.toggle('clicked')
				hideElem(null, null, this)
			}
		})
}

function initParams() {
	const data = JSON.parse(localEnc(disposableData, false))

	const initInput = (dom, cat, base) => (id(dom).value = cat !== undefined ? cat : base)
	const initCheckbox = (dom, cat) => (id(dom).checked = cat ? true : false)
	const isThereData = (cat, sub) => (data[cat] ? data[cat][sub] : undefined)

	// 1.9.2 ==> 1.9.3 lang break fix
	if (data.searchbar_engine) data.searchbar_engine = data.searchbar_engine.replace('s_', '')

	// 1.10.0 custom background slideshow
	const whichFreq = data.background_type === 'custom' ? data.custom_every : isThereData('dynamic', 'every')
	const whichFreqDefault = data.background_type === 'custom' ? 'pause' : 'hour'

	if (data.clock) toggleClockOptions(data.clock.analog)
	initInput('i_type', data.background_type, 'dynamic')
	initInput('i_freq', whichFreq, whichFreqDefault)
	initInput('i_blur', data.background_blur, 15)
	initInput('i_bright', data.background_bright, 0.85)
	initInput('i_dark', data.dark, 'system')
	initInput('i_sbengine', data.searchbar_engine, 'google')
	initInput('i_clockface', isThereData('clock', 'face'), 'none')
	initInput('i_timezone', isThereData('clock', 'timezone'), 'auto')
	initInput('i_collection', isThereData('dynamic', 'collection'), '')
	initInput('i_ccode', isThereData('weather', 'ccode'), 'US')
	initInput('i_row', data.linksrow, 8)
	initInput('i_customfont', isThereData('font', 'family'), '')
	initInput('i_weight', isThereData('font', 'weight'), 400)
	initInput('i_size', isThereData('font', 'size'), 13)
	initInput('i_greeting', data.greeting, '')
	initInput('cssEditor', data.css, '')

	initCheckbox('i_showall', data.showall)
	initCheckbox('i_geol', isThereData('weather', 'location'))
	initCheckbox('i_units', isThereData('weather', 'unit') === 'imperial')
	initCheckbox('i_linknewtab', data.linknewtab)
	initCheckbox('i_sb', data.searchbar)
	initCheckbox('i_sbnewtab', !!data.searchbar_newtab)
	initCheckbox('i_usdate', data.usdate)
	initCheckbox('i_ampm', isThereData('clock', 'ampm'), false)
	initCheckbox('i_seconds', isThereData('clock', 'seconds'), false)
	initCheckbox('i_analog', isThereData('clock', 'analog'), false)

	//hide elems
	hideElem(null, document.querySelectorAll('#hideelem button'), null)

	//Font weight
	if (data.font) modifyWeightOptions(data.font.availWeights)

	//input translation
	id('i_title').setAttribute('placeholder', tradThis('Name'))
	id('i_greeting').setAttribute('placeholder', tradThis('Name'))
	id('i_import').setAttribute('placeholder', tradThis('Import code'))
	id('i_export').setAttribute('placeholder', tradThis('Export code'))
	id('i_customfont').setAttribute('placeholder', tradThis('Any Google fonts'))
	id('cssEditor').setAttribute('placeholder', tradThis('Type in your custom CSS'))

	//bg
	if (data.background_type === 'custom') {
		id('custom').style.display = 'block'
		localBackgrounds(null, true)
	} else {
		id('dynamic').style.display = 'block'
	}

	//weather settings
	if (data.weather && Object.keys(data).length > 0) {
		let cityPlaceholder = data.weather.city ? data.weather.city : 'City'
		id('i_city').setAttribute('placeholder', cityPlaceholder)

		if (data.weather.location) id('sett_city').setAttribute('class', 'city hidden')
	} else {
		id('sett_city').setAttribute('class', 'city hidden')
		id('i_geol').checked = true
	}

	//searchbar display settings
	data.searchbar ? id('searchbar_options').classList.toggle('shown') : ''

	//langue
	id('i_lang').value = data.lang || 'en'

	//firefox export
	if (!navigator.userAgent.includes('Chrome')) {
		id('submitExport').style.display = 'none'
		id('i_export').style.width = '100%'
	}
}

function importExport(select, isEvent) {
	//
	function filterImports(data) {
		let result = { ...data }

		// Old blur was strings
		if (typeof data.background_blur === 'string') {
			result.background_blur = parseFloat(data.background_blur)
		}

		// 's_' before every search engines
		if (data.searchbar_engine) {
			result.searchbar_engine = data.searchbar_engine.replace('s_', '')
		}

		// New collection key missing
		if (data.dynamic)
			if (!data.dynamic.collection) {
				result.dynamic = { ...data.dynamic, collection: '' }
			}

		// Si il ne touche pas au vieux hide elem
		if (data.hide)
			if (data.hide.length === 0) {
				result.hide = [[0, 0], [0, 0, 0], [0], [0]]
			}

		return result
	}

	if (select === 'exp') {
		const input = id('i_export')
		const isOnChrome = navigator.userAgent.includes('Chrome')

		chrome.storage.sync.get(null, (data) => {
			input.value = JSON.stringify(data)

			if (isEvent) {
				input.select()

				//doesn't work on firefox for security reason
				//don't want to add permissions just for this
				if (isOnChrome) {
					document.execCommand('copy')
					id('submitExport').innerText = tradThis('Copied')
				}
			}
		})
	} else if (select === 'imp') {
		if (isEvent) {
			const dom = id('i_import')
			const placeholder = (str) => dom.setAttribute('placeholder', tradThis(str))

			if (dom.value.length > 0) {
				try {
					chrome.storage.sync.set(filterImports(JSON.parse(dom.value)), () => location.reload())
				} catch (e) {
					dom.value = ''
					placeholder('Error in import code')
					setTimeout(() => placeholder('Import code'), 2000)
				}
			}
		}
	} else if (select === 'reset') {
		let input = id('submitReset')

		if (!input.hasAttribute('sure')) {
			input.innerText = 'Are you sure ?'
			input.setAttribute('sure', '')
		} else {
			deleteBrowserStorage()
			setTimeout(function () {
				location.reload()
			}, 20)
		}
	}
}

function showSettings() {
	function display() {
		const edit = id('edit_linkContainer')

		if (has('settings', 'shown')) {
			clas(domshowsettings.children[0], '')
			clas(id('settings'), '')
			clas(dominterface, '')

			edit.classList.remove('pushed')
		} else {
			clas(domshowsettings.children[0], 'shown')
			clas(id('settings'), 'shown')
			clas(dominterface, 'pushed')

			edit.classList.add('pushed')
		}
	}

	function functions() {
		initParams()
		traduction(true)

		setTimeout(() => {
			display()
			showall()
			settingsEvents()
			signature()
		}, 10)
	}

	function init() {
		fetch('settings.html').then((resp) =>
			resp.text().then((text) => {
				const dom = document.createElement('div')
				dom.id = 'settings'
				dom.innerHTML = text
				document.body.appendChild(dom)

				functions()
			})
		)
	}

	if (!id('settings')) init()
	else display()
}

function showInterface(e) {
	//cherche le parent du click jusqu'a trouver linkblocks
	//seulement si click droit, quitter la fct
	let parent = e.target

	while (parent !== null) {
		parent = parent.parentElement
		if (parent && parent.id === 'linkblocks' && e.which === 3) return false
	}

	//close edit container on interface click
	if (has('edit_linkContainer', 'shown')) {
		clas(id('edit_linkContainer'), '')
		domlinkblocks.querySelectorAll('.l_icon_wrap').forEach(function (e) {
			clas(e, 'l_icon_wrap')
		})
	}

	if (has('settings', 'shown')) {
		let edit = id('edit_linkContainer')
		let editClass = edit.getAttribute('class')

		clas(id('showSettings').children[0], '')
		clas(id('settings'), '')
		clas(dominterface, '')

		if (editClass === 'shown pushed') clas(edit, 'shown')
	}
}

//
// Onload
//

//si la langue a été changé
if (sessionStorage.lang) {
	setTimeout(() => showSettings(), 20)
}

domshowsettings.onmouseup = function () {
	showSettings()
}
dominterface.onmousedown = function (e) {
	showInterface(e)
}

document.onkeydown = function (e) {
	//focus la searchbar si elle existe et les settings sont fermé
	const searchbar = id('sb_container') ? has('sb_container', 'shown') : false
	const settings = id('settings') ? has('settings', 'shown') : false
	const noEdit = id('edit_linkContainer').style.display === 'none'

	if (searchbar && !settings && noEdit) id('searchbar').focus()

	//press escape to show settings
	if (e.code === 'Escape') showSettings()
}
