var env = Components.classes['@tombfix.github.io/tombfix-service;1'].getService().wrappedJSObject;

var elmModels = document.getElementById('models');
var elmUsers = document.getElementById('users');

elmModels.addEventListener('select', function(e){
	// ユーザー名の取得で非同期処理を挟むため、その間再描画を止める
	if(elmUsers.refreshing)
		return;
	
	var model = env.Models[elmModels.value];
	elmUsers.refreshing = true;
	(model.getCurrentUser? model.getCurrentUser() : succeed()).addCallback(function(user){
		env.clearChildren(elmUsers);
		
		model.getPasswords().forEach(function(pw){
			var item = elmUsers.appendItem(pw.user, pw.password);
			item.setAttribute('class', 'listitem-iconic');
			if(pw.user == user){
				elmUsers.selectedItem = item;
				item.setAttribute('image', 'chrome://tombfix/skin/tick.png');
				item.disabled = true;
			} else {
				item.setAttribute('image', 'chrome://tombfix/skin/empty.png');
			}
		});
		elmUsers.refreshing = false;
	});
}, true);

env.forEach(env.Models.values, function(m){
	if(!m.login || !m.getPasswords || !m.getPasswords().length)
		return;
	
	elmModels.appendItem(m.name, m.name).setAttribute('src', m.ICON);
});

window.addEventListener('load', function(){
	elmModels.selectedIndex = 0;
}, true);

window.addEventListener('dialogaccept', function(){
	var item = elmUsers.selectedItem;
	env.Models[elmModels.value].login(item.label, item.value);
}, true);
