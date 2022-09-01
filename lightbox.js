/**!
 * Modul LightBox
 *
 * Das Modul ermöglicht die Anzeige von HTML-Elementen in einer modalen LightBox.
 *
 * Das Modul setzt folgende Struktur im html-Dokument voraus:
 * 1  <div id="eineID" class="lb">
 * 2  </div>
 * 3  <button onclick='showLbFigure ("eineID", "einBild.jpg", "ein Text"); '>Bild anzeigen</button>
 *
 * 1: Das umschließende div-Element der Klasse 'lightBox'.
 * 2: Das Element zum Abschließen der LightBox
 * 3: Ein beliebiges Element mit Event-Handler zum öffnen der LightBox
 *
 * Die Darstellung der Elemente der LightBox wird über Klassen gesteuert,
 * die in der Datei lightbox.css definiert sind.
 *
 * Folgende Funktionen werden vom Modul LightBox zur Verfügung gestellt:
 * 
 * lb.init ();                                  // Intitialisierung der Variablen (Option)
 * lb.show (anId);                              // Anzeige der LightBox, ohne irgendeinen Inhalt
 *												// Tastatur- und Mausereignisse werden nicht behandelt
 * lb.showLb (anId, options);                   // Anzeige der Lightbox mit Schließen-Button
 * lb.showLbImage (anId, anImage, options);     // Anzeige eines Bildes in der LightBox
 * lb.setCaption(anElement, aCaption);          // Eine Bildunterschrift an das Bild anfügen/ändern
 * lb.showLbFigure (anId, anImage, aCaption, options); // Anzeige eines Bildes mit Bildunterschrift
 * lb.hide ();									// Die LightBox schließen (verbergen) (Option)
 * lb.get ();                                   // Das akltuelle LightBox-Element abfragen (Option)
 * lb.getVisibility ();                         // Die Sichtbarkeit der lightBox abfragen (Option)
 * lb.getScrollbarWidth ();                     // Breite des Scrollbalkens in Pixeln ermitteln (Option)
 * lb.getVersion ();                            // Ermitteln der Modulversion. Änderung der Minor-Version:
 *                                              // Abwärtskompatible Funktionserweiterung
 *
 * Folgende Parameter werden übergeben:
 *
 * anID:            Typ: String         Die ID der LightBox. Die ID muss im html-Dokument eindeutig sein!
 * anImage:         Typ: String         Dateineme bzw. url eines Bildes das in der LightBox angezeigt wird.
 * anElement:       Typ: Objekt         Bild-Objekt (Tag), in das eine Bildunterschrift integriert wird
 * aCaption:        Typ: String         Die Bildunterschrift (Caption)
 * options:         Typ: Object         Optionen, mit denen das Verhalten der LightBox beeinflusst werden kann.
 *   noCloseButton: Typ: Boolean        Die Anzeige des Schließen-Buttons wird unterdrückt
 *   closeOnClick:  Typ: Boolean        Durch einen Click auf die Fläche der LightBox wird diese geschlossen
 *   noKeyControl:  Typ: Boolean        Keine Überwachung der Tastatur (Schließen mit [ESC] nicht möglich)
 *                                          jedoch mit [Leerzeichen] oder [Return] (Defaultverhalten des Buttons)
 *
 *
 * Änderungshistorie
 *
 * 01.03.2022: V3.5 Tastaturüberwachung verbessert (lbGal)
 * 26.02.2022: V3.4 Der Focus wird beim Schließen der LightBox wiederhergestellt
 * 21.02.2022: V3.3 Der Focus wird auf den Schließen-Button gesetzt
 * 19.02.2022: V3.2 Tastaturbehandlung erweitert (Schließen mit Enter und Leerzeichen)
 * 03.01.2022: V3.1 Funktion getVersion() hinzugefügt
 * 10.01.2022: V3.0 Funktion setCaption() öffentlich gemacht und Funktion get() hinzugefügt
 * 23.12.2021: Option noKeyControl hinzugefügt
 * 17.12.2021: Fehlerkorektur in der Funktion _showLbFigure()
 * 15.12.2021: Alle Elemente innerhalb der LightBox werden automatisch eingefügt
 *             Objekt von lightBox nach lb umbenannt, LightBox blendet die Scrollbalken aus
 * 29.11.2021: Inhalt des Close-Buttons als Konstante definiert
 *             append() durch appendChild() ersetzt
 * 26.11.2021: Warnmeldungen in der Funktion __checkId() verbessert 
 * 24.11.2021: Die Klasse 'panel' in 'lbPanel' umbenannt
 *             z-index aus css-Datei entfernt
 * 16.01.2021: Der Key-Down-Handler reagiert auf key an Stelle des veralteten keyCode
 *             Der aktive Handler verhindert, dass die Seite scrollt
 * 18.12.2020: Der Button zum Schließen der Lightbox wird automatisch eingefügt
 * 16.12.2020: Die Statusvariable _visibility und den Getter getVisibility() hinzugefügt
 * 14.12.2020: Funktionen geben TRUE zurück, wenn die Funktion erfolgreich war 
 * 18.11.2020: Schließen-Icon von FontAwesome übernommen (fa-times) 
 * 15.08.2020: Funktion zum Anzeigen eines Bildes mit Unterschrift integriert
 * 14.08.2020: Funktion zum Anzeigen eines Bildes integriert
 * 01.08.2020: Als Modul definiert
 *
 **/

"use strict";

var lb = (function () {                                                         // Revealing Module Pattern
    /* Private Konstanten, als var deklariert **********************************/

    var __LBDEFAULTID = "lightBox";                                             // Default-ID der lightBox
    var __LBCLOSECONTENT =                                                      // Inhalt des Close-Buttons
            "<svg aria-hidden='true' focusable='false' data-prefix='fas' data-icon='times' class='svg-inline--fa fa-times fa-w-11' role='img' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 352 512'>" +
                "<path fill='currentColor' d='M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z'></path>" +
            "</svg>";

    /* Private Variablen *******************************************************/

	var __scrollbarWidth;                                                       // Breite des Scrollbalkens
    var __overflow;                                                             // Die Eigenschaft overflow des body-Elements
	var __paddingRight;                                                         // Die Eigenschaft paddingRight des body-Elements
	var __activeElement;                                                        // Das aktive Element vor Öffnen der LightBox
    var __lightBox;                                                             // Das LightBox-Element
    var __closeBtn;                                                             // Der Button zum Schließen der LightBox
	var __image;																// Das Bild
    var __caption;																// Die Bildunterschrift
    var __visibility;                                                           // Die Zustandsvariable, Defaultwert: false
    var __closeOnClick;                                                         // Option: Schließen bei Click auf die Fläche der LightBox
	var __noCloseButton;                                                        // Option: Kein Schließen-Button
	var __noKeyControl;                                                         // Option: Keine Tastatursteuerung

    /* Private Funktionen ******************************************************/

    function __checkId(anId) {                                                  // Plausibilitätsprüfung der lightBox-ID
        var idLightBox;                                                         // ID der lightBox

        if (anId == null) {                                                     // Wurde eine ID übergeben?
        	idLightBox = __LBDEFAULTID;                                         // Nein den Defaultwert übernehmen
        } else {
            if (typeof anId != "string") {                                      // Wurde ein String übergeben?
                                                                                // Nein, mit Fehlermeldung ..
                console.warn ("lightBox.__checkId: ID '" + String(anId) + "' is not a string!");
                return false;                                                   // .. abbrechen
            };
            idLightBox = anId;                                                  // Ja, diese ID übernehmen
        };
        __lightBox = document.getElementById(idLightBox);                       // Das Element der lightBox ermitteln
        if (__lightBox == null) {                                               // Wurde das Element gefunden?
            console.warn ("lightBox.__checkId: ID '" + anId + "' not found!");  // Nein, mit Fehlermeldung ..
            return false;                                                       // .. abbrechen
        } else {
            return true;                                                        // Alles OK!
        };
    }

    function __checkOptions(options) {											// Die übergebenen Optionen prüfen
        if (options === undefined) options = {};                                // Wenn keine Option übergeben wurde 
        if (options.closeOnClick === undefined) {
            __closeOnClick = false;                                             // Defaultwert: false
        } else {
            __closeOnClick = options.closeOnClick;                              // Den übergebenen Wert übernehmen
        };
        if (options.noCloseButton === undefined) {
            __noCloseButton = false;                                            // Defaultwert: false
        } else {
            __noCloseButton = options.noCloseButton;                            // Den übergebenen Wert übernehmen
        };
        if (options.noKeyControl === undefined) {
            __noKeyControl = false;                                             // Defaultwert: false
        } else {
            __noKeyControl = options.noCloseButton;                             // Den übergebenen Wert übernehmen
        };
	}

    function __appendButton(anElement) {                                        // Einen Schließen-Butten in die lightBox integrieren
        var closeButton = null;

		if (__noCloseButton !== true) {											// Nur wenn die Option nicht gesetzt ist ..
            closeButton = document.createElement ("button");                    // Das Button-Element erzeugen ..
            closeButton.type = "button";                                        // Den Typ des Buttons festlegen, ..
            closeButton.classList.add("close");                                 // .. der Klasse 'close' zuordnen, ..
            closeButton.innerHTML = __LBCLOSECONTENT;                           // .. das oben definierte Icon hinzufügen ..
            anElement.appendChild(closeButton);                                 // .. und das Ganze in die lightBox integrieren
		};
        return closeButton;                                                     // Rückgabewert ist der Button
    }

    function __appendImage(anElement) {                                         // Eine Bild in die lightBox integrieren
        var image = null;

        image = document.createElement ("div");                                 // Das Div-Element für das Bild erzeugen ..
        image.classList.add("lbImage");                                         // .. der Klasse 'lbImage' zuordnen, ..
        anElement.appendChild(image);                                           // .. und das Ganze in die lightBox integrieren
        return image;                                                           // Rückgabewert ist das Coption-Tag
    }

    function __showLightBox() {                                             	// Funktion zum Anzeigen der lightBox. Die ID ist optional
        var cW = document.body.clientWidth;                                     // Die aktuelle Breite des Fensters
        __overflow = document.body.style.overflow;                              // Den aktuellen Status des Overflow ermitteln, ...
		__paddingRight = document.body.style.paddingRight;                      // .. den aktuellen Status von paddingRight ermitteln ..
		document.body.style.overflow = "hidden";                                // und den vertikale Scrollbalken verbergen
		if (cW !== document.body.clientWidth) {                                 // Gab es einen Scrollbalken?
            if (__paddingRight === "") {                                        // hatte paddingRight einen Wert?
                  document.body.style.paddingRight = __scrollbarWidth + "px";   // Nein, nur die Breite des Scrollbalkens
            } else {
                  document.body.style.paddingRight = "calc(" + __scrollbarWidth + "px + " + __paddingRight + ")";
            };
        };
        __activeElement = document.activeElement;                               // Das aktive Element sichern
        __closeBtn = __lightBox.querySelector ("button.close");                 // Den Close-Button ermitteln
        if (__closeBtn == null) {                                               // Existiert er?
            __closeBtn = __appendButton (__lightBox);                           // Einen Schließen-Butten in die lightBox integrieren
        };
        __lightBox.classList.add("displayBlock");                               // Die LightBox sichtbar machen .. 
        setTimeout(function() {
            __lightBox.classList.add("opacity1");                               // .. und kurz darauf einblenden
            if (__noKeyControl === false) {                                     // Ist die Option nicht gesetzt?
                document.body.addEventListener("keydown", __keyDown);           // Die Event-Listener aktivieren
            };
			if (__noCloseButton !== true) {                                     // Nur wenn die Option nicht gesetzt ist ..
                __closeBtn.addEventListener("click", _hide);                    // .. den Event-Listener aktivieren ..
                __closeBtn.focus();                                             // .. und den Focus auf den Button setzen.
			};
            if (__closeOnClick) __lightBox.addEventListener("click", __onClick);
        }, 50);
          __visibility = true;                                                  // Die Zustandsvariable setzen
        return true;
    }

    /* Event-Handler ***********************************************************/

    function __keyDown(event) {                                                 // Behandlung der Tastatureingaben
    switch (event.key) {
        case "Escape":                                                          // [Esc]
            _hide();                                                            // LightBox verbergen (schließen)
            break;
        case " ":
        case "Enter":
        case "F5":                                                              // [F5]
        case "F12":                                                             // [F12]
            break;
        default:
            event.preventDefault();                                             // Bearbeitung durch den Browser unterdrücken
        };        
    }
    
    function __onClick(event) {                                                 // Behandlung von Mausclicks
        var target = event.target;                                              // Das angeklickte Element
        if (target.tagName === "DIV" && target.classList[0] === "lb") {         // Ist es ein div der Klasse 'lb'?
            _hide();                                                            // LightBox verbergen (schließen)
        };
    }

    /* Öffentlich zugängliche Funktionen ***************************************/

    function _init() {
        if (__visibility === undefined) {										// Wenn noch nicht initialisiert ...
            __overflow = "";                                                    // Die Eigenschaft des body-Elements
            __visibility = false;                                               // Die Zustandsvariable, Defaultwert: false
            __closeOnClick = false;                                             // Option: Schließen bei Click auf die Fläche der LightBox
	        __noCloseButton = false;                                            // Option: Kein Schließen-Button
		    __scrollbarWidth = _getScrollbarWidth();                            // Die Breite des Scrollbalkens ermitteln
		};
	}

    function _show(anId) {                                                      // Funktion zum Anzeigen der LightBox, ohne Inhalt
    	if (__checkId(anId) === false) return false;                            // Abbrechen, wenn die ID n.i.O. ist
        __lightBox.classList.add("displayBlock");                               // Die LightBox sichtbar machen .. 
        setTimeout(function() {
            __lightBox.classList.add("opacity1");                               // .. und einblenden
        }, 50);
        __visibility = true;                                                    // Die Zustandsvariable setzen
        return true;
    }

    function _showLb(anId, options) {                                           // Funktion zum Anzeigen der lightBox. Die ID ist optional
		_init();                                                                // Die internen Variablen setzen und ermitteln
    	if (__checkId(anId) === false) return false;                            // Abbrechen, wenn die ID n.i.O. ist
        __checkOptions (options);                                               // Die übergebenen Optionen prüfen
    	return __showLightBox();                                                // Die LightBox anzeigen
    }

    function _showLbImage(anId, anImage, options) {                             // Funktion zum Anzeigen des Bildes
		_init();                                                                // Die internen Variablen setzen und ermitteln
    	if (__checkId(anId) === false) return false;                            // Abbrechen, wenn die ID n.i.O. ist
        __checkOptions (options);                                               // Die übergebenen Optionen prüfen
        __image = __lightBox.querySelector ("div.lbImage");                     // Das Image-Tag ermitteln
            if (__image == null) {                                              // Existiert es noch nicht?
                __image = __appendImage (__lightBox);                           // Das Image-Tag in die lightBox integrieren
            };
        __image.style.backgroundImage = "url('" + anImage + "')";               // Das Bild im Hintergrund anzeigen
        return __showLightBox();                                                // Die LightBox anzeigen
    }

    function _setCaption(anElement, aCaption) {                                 // Eine Bildunterschrift (Caption) in das Element der ..
																				// .. LightBox integrieren oder diese aktualisieren
        var caption = null;														// Das div-Element der Bildunterschrift

        if ((typeof aCaption === "string")                                      // Wurde ein string übergeben ..
		&& (aCaption !== "")) {													// .. und ist der String nicht leer?
            caption = anElement.querySelector ("div.lbCaption");                // Das Caption-Tag ermitteln
            if (caption === null) {                                             // Existiert es noch nicht?
                caption = document.createElement ("div");                       // Das div-Element erzeugen
                caption.classList.add("lbCaption");                             // .. der Klasse 'lbCaption' zuordnen, ..
                anElement.appendChild(caption);                                 // .. und das Ganze in die lightBox integrieren
            };
            caption.innerHTML = aCaption;                                       // Den Text in das div-Tag integrieren
        } 
		else {																    // Es wurde keine Bildunterschrift übergeben
            caption = anElement.querySelector ("div.lbCaption");                // Das Caption-Tag ermitteln
            if (caption !== null) {                                             // Existiert es?
			    caption.parentNode.removeChild(caption);						// Ja, aus dem DOM entfernen
			};
		};
        return caption;                                                         // Rückgabewert ist das Coption-Tag
    }

    function _showLbFigure(anId, anImage, aCaption, options) {                  // Funktion zum Anzeigen des Bildes mit Unterschrift
		_init();                                                                // Die internen Variablen setzen und ermitteln
    	if (__checkId(anId) === false) return false;                            // Abbrechen, wenn die ID n.i.O. ist
        __checkOptions (options);                                               // Die übergebenen Optionen prüfen
        __image = __lightBox.querySelector ("div.lbImage");                     // Das Image-Tag ermitteln
            if (__image == null) {                                              // Existiert es noch nicht?
                __image = __appendImage (__lightBox);                           // Das Image-Tag in die lightBox integrieren
            };
        __image.style.backgroundImage = "url('" + anImage + "')";               // Das Bild im Hintergrund anzeigen
		__caption = _setCaption (__image, aCaption);						    // Das Caption-Tag in die lightBox integrieren
        return __showLightBox();                                                // Die LightBox anzeigen
    }

    function _hide() {
        __lightBox.removeEventListener("click", __onClick);
        if (__closeBtn != null) __closeBtn.removeEventListener("click", _hide); // Die Event-Listener deaktivieren
        document.body.removeEventListener("keydown", __keyDown);
        __lightBox.classList.remove("opacity1");                                // Die LightBox ausblenden ..        
        setTimeout(function() {
            __lightBox.classList.remove("displayBlock");                        // .. und unsichtbar machen
            __visibility = false;                                               // Die Zustandsvariable zurücksetzen
            document.body.style.overflow = __overflow;                          // Den Overflow restaurieren
			document.body.style.paddingRight = __paddingRight;                  // Padding-right restaurieren
			if (__activeElement) {                                              // War das aktive Element gesetzt?
			    __activeElement.focus();                                        // ja, den Fokus auf das zuvor aktive Element setzen
			};
			__activeElement = null;                                             // Das aktive Element zurücksetzen
        }, 1000);
        return true;                                                            // OK
    }
    
    function _get() {                                                           // Die LightBox-Element abfragen
        return __lightBox;                                                      // Das Objekt zurückgeben
    }

    function _getVisibility() {                                                 // Die Sichtbarkeit der lightBox abfragen
        return __visibility;                                                    // Die Zustandsvariable zurückgeben
    }
    
	function _getScrollbarWidth() {                                             // Ermittelt die breite des Scrollbalkens
        var element;                                                            // Ein Element ..
        element = document.createElement("div");                                // .. wird erzeugt ..
        element.style.cssText = "width: 100px; height: 100px; overflow: scroll; position: fixed; bottom: -100px;";
        document.body.appendChild(element);	                                    // und als letztes Element zugeordnet
        __scrollbarWidth = element.offsetWidth - element.clientWidth;           // Die Breite ermittel
        document.body.removeChild(element);                                     // Das Element wird nicht mehr benötigt
        return __scrollbarWidth;                                                // Die Breite zurückgeben
        }
	
    /* Gebe öffentliches API zurück ********************************************/    
    return {
		init:           _init,                                                  // Die Initialisierung muss nach dem Laden des Document erfolgen
        show:           _show,                                                  // Anzeigen des LightBox, ohne Inhalt
        showLb:         _showLb,                                                // Anzeigen der lightBox
        showLbImage:    _showLbImage,                                           // Anzeigen der lightBox mit Bild
		setCaption:     _setCaption,                                            // Eine Bildunterschrift an das Bild anfügen/ändern
        showLbFigure:   _showLbFigure,                                          // Anzeigen der lightBox mit Bild und Bildunterschrift
        hide:           _hide,                                                  // Schließen der lightBox (Option)
		get:		    _get,      												// Das akltuelle LightBox-Element abfragen (Option)
        getVisibility:  _getVisibility,                                         // Die Sichtbarkeit der lightBox abfragen (Option) 
		getScrollbarWidth: _getScrollbarWidth,                                  // Die Breite des Scrollbalkens abfragen (Option)
		getVersion:    function () { return 3.5; }                              // Die Versionsnummer zurückgeben                        
    };    
}) ();
