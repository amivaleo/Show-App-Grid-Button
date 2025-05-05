/* You can do whatever you want with this code, but I hope that, if you want to
 * improve it, you will talk to me so we can discuss and implement your idea into
 * this very same extension. It's just to keep things neat and clean, instead of
 * polluting EGO with plenty of similar extensions that do almost the same thing.
 *
 * If you want to debug this extension, open 'metadata.json' and set 'debug' to true.
 * You can read the debugging messages in the terminal if you give the following:
 * $ journalctl -f -o cat /usr/bin/gnome-shell
 */

import Shell from 'gi://Shell';
import St from 'gi://St';
import Meta from 'gi://Meta';
import GLib from 'gi://GLib';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import {Extension, gettext as _} from 'resource:///org/gnome/shell/extensions/extension.js';

let extensionName;
let Settings;
let panelButton;

/* get panel button
 */
function getPanelButton() {
	panelButton = new PanelMenu.Button(0.0, `${extensionName}`, false);
	let icon = new St.Icon({
		icon_name: 'view-app-grid-symbolic',
		style_class: 'system-status-icon',
	});
	
	panelButton.add_child(icon);
  panelButton.connect('button-press-event', () => {
    if (!Main.overview._shown) {  // overview hidden
      Main.overview.showApps();
    } else if (Main.overview._shown && !Main.overview._overview._controls._appDisplay.visible) {  // overview shown on window thumbnails
      Main.overview.hide();
      Main.overview.showApps();
    } else { // overview shown on app-grid
      Main.overview.hide();
    }
  });
	panelButton.connect('touch-event', () => {
    if (!Main.overview._shown && !Main.overview._overview._controls._appDisplay.visible ) {  // overview hidden
      Main.overview.showApps();
    } else if (Main.overview._shown && !Main.overview._overview._controls._appDisplay.visible) {  // overview shown on window thumbnails
      Main.overview.hide();
      Main.overview.showApps();
    } else { // overview shown on app-grid
      Main.overview.hide();
    }
  });
	return panelButton;
}

function setShowAppsButtonVisibility() {
  if (Settings.get_boolean('show-apps-button-visibility')) {
    Main.overview.getShowAppsButton().show();
  } else {
    Main.overview.getShowAppsButton().hide();
  }
}

/* add button to panel
 */
function addPanelButton() {
	let qualifier = [0, 1];
	let index = Settings.get_enum('button-position');
	Main.panel.addToStatusArea(`${extensionName} Button`, getPanelButton(), qualifier[index], 'left');
}

/* remove button from panel
 */
function removePanelButton() {
	panelButton.destroy();
	panelButton = null;
}

export default class extends Extension {
	/* enable extension
	*/
	enable() {
	  extensionName = this.metadata.name;
	  	Settings = this.getSettings();
		Settings.connect('changed::show-apps-button-visibility', () => {
			setShowAppsButtonVisibility();
		});
 
		Settings.connect('changed::button-position', () => {
			removePanelButton();
			addPanelButton();
		});
		addPanelButton();
	}
	
	/* disable extension
	*/
	disable() {
	  Main.overview.getShowAppsButton().show(); // Reset Show Apps Button visibility
	  Settings = null;
	  removePanelButton();
	}
}

