import Adw from "gi://Adw";
import Gio from "gi://Gio";
import Gtk from "gi://Gtk";
import { ExtensionPreferences, gettext as _ } from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export default class ShowAppGridButtonPrefs extends ExtensionPreferences {
	fillPreferencesWindow(window) {
		const settings = this.getSettings();
		const page = new Adw.PreferencesPage();
		const group = new Adw.PreferencesGroup();
		page.add(group);
		window.add(page);
	  window.connect('close-request', this.on_destroy.bind(this)); // Cleanup on close
		
		
		
		// Row for the ShowAppsButtonVisibility setting
		const rowShowAppsButtonVisibility = new Adw.ActionRow({
			title: _("Keep Show Apps button"),
			subtitle: _("Keep the Show Apps button visible on the dock."),
		});
		
		const switchShowAppsButtonVisibility = new Gtk.Switch({
			active: settings.get_boolean('show-apps-button-visibility'), // Set initial state from the setting
			valign: Gtk.Align.CENTER,
		});
		switchShowAppsButtonVisibility.connect('state-set', (widget, state) => {
			settings.set_boolean('show-apps-button-visibility', state);
		});
		settings.connect('changed::show-apps-button-visibility', () => {
			switchShowAppsButtonVisibility.set_active(settings.get_boolean('show-apps-button-visibility'));
		});
		
		rowShowAppsButtonVisibility.add_suffix(switchShowAppsButtonVisibility);
		group.add(rowShowAppsButtonVisibility);
	
	  
	  
		// Row for the button position setting
		const buttonPosition = new Adw.ComboRow({
			title: _('Position on Panel'),
			subtitle: _("Position respect to the workspace indicator on the top-left."),
			model: new Gtk.StringList({ strings: [_("Left"), _("Right")] }),
		});
		buttonPosition.set_selected(settings.get_enum('button-position'));
		buttonPosition.connect('notify::selected', () => {
			settings.set_enum('button-position', buttonPosition.selected);
		});
		
		group.add(buttonPosition);
	}
	
	on_destroy() {}
}
