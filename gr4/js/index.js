function LitteraeIndex(el) {
    var self  = this;

    // tie in the DOM
    this.el = el;
    this.el_groups = document.getElementById('groups-table-div');
    this.el_texts = document.getElementById('texts-table-div');

    this.el_overlay = document.getElementById('black-overlay');
    this.el_new_group = document.getElementById('new-group-div');
    this.el_add_text = document.getElementById('add-text-div');

    this.el_btn_addgroup = document.getElementById('add-grp-btn');
    this.el_btn_creategroup = document.getElementById('btn-create-group');

    this.el_btn_addtext = document.getElementById('add-text-btn');
    this.el_btn_createtext = document.getElementById('create-text-btn');
    // state
    this.groups = getCannedGroups();
    this.texts = [];
    this.user = getCannedCurrentUser();

    // nested views
    this.groupsView = new GroupListView(this.groups);
    this.el_groups.appendChild(this.groupsView.el);
    this.textsView = null;

    this.groupsView.on('select', function(){self.openGroup(self.groupsView.selectedGroup)});

    // event binding

    this.el_btn_addgroup.addEventListener('click', this.openCreateGroupDialog.bind(this));
    this.el_btn_creategroup.addEventListener('click', this.createGroup.bind(this));
    
    this.el_btn_addtext.addEventListener('click', this.openCreateTextDialog.bind(this));
    this.el_btn_createtext.addEventListener('click', this.createText.bind(this));

    this.el_overlay.addEventListener('click', this.closeModals.bind(this));
}
LitteraeIndex.prototype.openGroup = function(group) {
    if (this.textsView) this.textsView.el.remove();
    this.textsView = new TextListView(group.texts);
    this.el_texts.appendChild(this.textsView.el);

    var text_label = document.getElementById('texts-label');
    Utils.setText(text_label, 'Texts in ' + this.groupsView.selectedGroup.name);
}
LitteraeIndex.prototype.openCreateGroupDialog = function() {
    Utils.show(this.el_overlay);
    Utils.show(this.el_new_group);
}
LitteraeIndex.prototype.createGroup = function() {
    Utils.hide(this.el_new_group);
    Utils.hide(this.el_overlay);

    var g = new Group();
    g.instructor = this.user;
    g.name = document.getElementById('new-group-name').value;

    this.groups.push(g);
    this.groupsView.update();
}
LitteraeIndex.prototype.openCreateTextDialog = function() {
    Utils.show(this.el_overlay);
    Utils.show(this.el_add_text);
    document.getElementById('new-text-name').value = '';
    document.getElementById('new-text-content').value = '';
    
    var group_name = document.getElementsByClassName('group-name')[0];
    Utils.setText(group_name, this.groupsView.selectedGroup.name);
}
LitteraeIndex.prototype.createText = function() {
    Utils.hide(this.el_add_text);
    Utils.hide(this.el_overlay);

    var g = this.groupsView.selectedGroup;

    var t = new Text();
    t.title = document.getElementById('new-text-name').value;
    t.content = document.getElementById('new-text-content').value;

    g.texts.push(t);
    this.openGroup(g);
    this.textsView.update();
}
LitteraeIndex.prototype.closeModals = function() {
    Utils.hide(this.el_new_group);
    Utils.hide(this.el_add_text);
    Utils.hide(this.el_overlay);
}
function GroupListView(groups) {
    this.groups = groups || [];

    this.selected = null;
    this.selectedGroup = null;

    var template = document.getElementById('tpl-grouplist');
    this.el = template.firstElementChild.cloneNode(true);
    this.el_list = this.el.getElementsByTagName('tbody')[0];

    this.groupItemViews = [];

    new Utils.EventHost(this);
    this.update();
}
GroupListView.prototype.update = function() {
    var self = this;
    // clear it out
    Utils.clearChildNodes(this.el_list);
    this.groupItemViews = [];

    // fill it up again (that's what she said)
    for (var i=0; i<this.groups.length; i++) {(function(i){
        var view = new GroupItemView(self.groups[i]);
        self.groupItemViews[i] = view;
        self.el_list.appendChild(view.el);

        view.el.addEventListener('click', function() {
            self.select(i);
        });
    })(i)};
}
GroupListView.prototype.select = function(n) {
    this.selected = n;
    this.selectedGroup = this.groups[n];

    for (var i=0; i<this.groups.length; i++) {
        this.groupItemViews[i].el.classList.toggle('selected', i==n);
    }
    this.trigger('select');
}

function TextListView(texts) {
    this.texts = texts || [];

    var template = document.getElementById('tpl-textlist');
    this.el = template.firstElementChild.cloneNode(true);
    this.el_list = this.el.getElementsByTagName('tbody')[0];

    this.update();
}
TextListView.prototype.update = function() {
    Utils.clearChildNodes(this.el_list);

    for (var i=0; i<this.texts.length; i++) {
        var view = new TextItemView(this.texts[i]);
        this.el_list.appendChild(view.el);
    }
}

function GroupItemView(group) {
    this.group = group;

    var template = document.getElementById('tpl-groupitem');
    this.el = template.firstElementChild.cloneNode(true);
    this.el_name = this.el.getElementsByClassName('name')[0];
    this.el_instructor = this.el.getElementsByClassName('instructor')[0];
    this.el_btn_leave = this.el.getElementsByClassName('leave-grp-btn')[0];

    this.update();
}
GroupItemView.prototype.update = function() {
    Utils.setText(this.el_name, this.group.name);
    Utils.setText(this.el_instructor, this.group.instructor.name);
}

function TextItemView(text) {
    this.text = text;

    var template = document.getElementById('tpl-textitem');
    this.el = template.firstElementChild.cloneNode(true);
    this.el_title = this.el.getElementsByClassName('title')[0];
    this.el_btn_delete = this.el.getElementsByClassName('del-text-btn')[0];

    this.update();
}
TextItemView.prototype.update = function() {
    var self = this;
    Utils.setText(this.el_title, this.text.title);
    this.el.addEventListener('click', function() {
        window.open('app.htm#text='+self.text.id, '_self');
    })
}
