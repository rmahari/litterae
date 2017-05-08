function LitteraeIndex(el) {
    var self  = this;

    // tie in the DOM
    this.el = el;
    this.el_groups = document.getElementById('groups-table-div');
    this.el_texts = document.getElementById('texts-table-div');

    // state
    this.groups = getCannedGroups();
    this.texts = [];

    // nested views
    this.groupsView = new GroupListView(this.groups);
    this.el_groups.appendChild(this.groupsView.el);
    this.textsView = null;

    this.groupsView.on('select', function(){self.openGroup(self.groupsView.selectedGroup)});
}
LitteraeIndex.prototype.openGroup = function(group) {
    if (this.textsView) this.textsView.el.remove();
    this.textsView = new TextListView(group.texts);
    this.el_texts.appendChild(this.textsView.el);
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
    Utils.setText(this.el_title, this.text.title);
}
