/**
 *  Description: select unique value from table (e.g. my_contact), this ui include search bar
 */
(function(){
        Titanium.include(Ti.App.Properties.getString('base_folder_name')+'fieldteam.js');
        var win = Titanium.UI.currentWindow;    
        var base_select_uniqute_code_from_table_view_with_search_bar_page_obj = null;

        function base_select_uniqute_code_from_table_view_with_search_bar_page(){
                var self = this;
                var window_source = 'base_select_uniqute_code_from_table_view_with_search_bar_page';
                win.title = win.win_title;

                //public method
                /**
                 *  override init function of parent class: fieldteam.js
                 */                     
                self.init = function(){
                        try{           
                                self.init_auto_release_pool(win);
                                self.data = [];
                                //call init_navigation_bar function of parent class: fieldteam.js
                                self.init_navigation_bar('Done','Main,Back');
                                //_init_search_bar();
                                //call init_table_view function of parent class: fieldteam.js
                                self.init_table_view();
                                //self.table_view.top = self.tool_bar_height;
                                //call init_no_result_label function of parent class: fieldteam.js
                                self.init_no_result_label();
                                _display();
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.init');
                                return;
                        }
                };
                /**
                 *  override nav_right_btn_click_event function of parent class: fieldteam.js
                 */                     
                self.nav_right_btn_click_event = function(e){
                        try{
                                if(!_is_selected){
                                        self.show_message('Please select an item.');
                                        return;
                                }   
                                if(e.index == self.default_main_menu_button_index){//menu menu
                                        self.close_all_window_and_return_to_menu(); 
                                }else{
                                        Ti.App.Properties.setBool('update_unique_code_with_search_'+win.source+'_view_flag',true);
                                        Ti.App.Properties.setString('update_unique_code_with_search_'+win.source+'_view_id',_selected_obj_id);
                                        Ti.App.Properties.setString('update_unique_code_with_search_'+win.source+'_view_content',_selected_name);
                                        win.close();
                                }                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.nav_right_btn_click_event');
                                return;
                        }
                };
                /**
                 *  override nav_left_btn_click_event function of parent class: fieldteam.js
                 */                     
                self.nav_left_btn_click_event = function(e){
                        try{
                                if(_selected_obj_id != win.content){
                                        var option_dialog = Ti.UI.createOptionDialog({
                                                options:(self.is_ipad())?['YES','NO','Cancel','']:['YES','NO','Cancel'],
                                                buttonNames:['Cancel'],
                                                destructive:0,
                                                cancel:2,
                                                title:L('message_save_changes')
                                        });
                                        option_dialog.show();
                                        option_dialog.addEventListener('click',function(evt){
                                                switch(evt.index){
                                                        case 0:
                                                                self.nav_right_btn_click_event(e);
                                                                break;
                                                        case 1:
                                                                if(e.index == self.default_main_menu_button_index){//menu menu
                                                                        self.close_all_window_and_return_to_menu(); 
                                                                }else{
                                                                        win.close();
                                                                }
                                                                break;
                                                        case 2://cancel
                                                                self.nav_left_btn.index = -1;
                                                                break;                                                                   
                                                }
                                        });                                          
                                }else{
                                        if(e.index == self.default_main_menu_button_index){//menu menu
                                                self.close_all_window_and_return_to_menu(); 
                                        }else{
                                                win.close();
                                        }
                                } 
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.nav_left_btn_click_event');
                                return;
                        }                          
                };                
                /**
                 *  override table_view_click_event function of parent class: fieldteam.js
                 */                     
                self.table_view_click_event = function(e){
                        try{
                                var index = e.index;
                                var section = e.section;
                                for(var i=0,j=self.data.length;i<j;i++){
                                        section.rows[i].hasCheck = false;
                                }
                                section.rows[index].hasCheck = true;
                                _selected_name = section.rows[index].title;
                                _selected_obj_id = section.rows[index].obj_id;
                                _is_selected = true;
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.table_view_click_event');
                                return;
                        }                           
                };

                //private member
                var _search_string = '';
                var _selected_obj_id = win.content;
                var _selected_name = win.content_value;
                var _is_selected = false;

                //private method
                /**
                 *  init search tool bar
                 */
                function _init_search_bar(){
                        try{
                                //add a toolbar with search field
                                var flexSpace = Titanium.UI.createButton({
                                        systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
                                });

                                self.searchBar = Ti.UI.createSearchBar({
                                        showCancel:false,
                                        hintText:'Search',
                                        autocapitalization:Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
                                        height:self.tool_bar_height,
                                        width:self.screen_width
                                });
                                var searchToolbar = Ti.UI.iOS.createToolbar({
                                        items:[flexSpace,self.searchBar,flexSpace],
                                        top:0,
                                        borderColor:self.tool_bar_color_in_ios_7,
                                        borderWidth:1
                                });
                                win.add(searchToolbar);      
                                self.searchBar.addEventListener('change',function(e){
                                        self.searchBar.showCancel = true;
                                        _search_string = e.value;
                                        _search_string = self.replace(_search_string,'\"','');//remove " symbol
                                        _search_string = self.replace(_search_string,'\'','');//remove ' symbol'                                              
                                        _display();
                                });

                                self.searchBar.addEventListener('return',function(e){
                                        self.searchBar.blur();
                                        self.searchBar.showCancel = false;
                                        _search_string = e.value;
                                        _search_string = self.replace(_search_string,'\"','');//remove " symbol
                                        _search_string = self.replace(_search_string,'\'','');//remove ' symbol'                                               
                                        _display();
                                });

                                self.searchBar.addEventListener('blur',function(){
                                        self.searchBar.showCancel = false;
                                });

                                self.searchBar.addEventListener('cancel',function(e){
                                        self.searchBar.showCancel = false;
                                        self.searchBar.value = '';
                                        self.searchBar.blur();
                                        _search_string = '';
                                        _display();
                                });

                                self.searchBar.addEventListener('focus', function(e){
                                        self.searchBar.showCancel = true;
                                });                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_search_bar');
                                return;
                        }                        
                }
                /**
                 *  display list
                 */
                function _display(){
                        try{
                                self.data = [];
                                self.table_view.setData([]);
                                var basic_query = 'SELECT * FROM '+win.table_name+' WHERE '+win.query_array.join(' and ');
                                if((win.existed_id_array != null) && (win.existed_id_array != '')){
                                        if(win.query_array.length > 0){
                                                basic_query += ' and ';
                                        }
                                        basic_query += ' id not in ('+win.existed_id_array+')';
                                }
                                var order_query = ' order by '+win.display_name+' asc';
                                var query_str = '';
                                var db = Titanium.Database.open(self.get_db_name());
                                var rows = null;
                                if((_search_string === '')||(_search_string === null)||(_search_string === undefined)){
                                        rows = db.execute(basic_query+order_query);
                                }else{ 
                                        query_str += ' and '+win.fuzzy_query+' like \'%'+_search_string+'%\' ';
                                        rows = db.execute(basic_query+query_str+order_query);
                                }
                                var b = 0;
                                if(rows.getRowCount() > 0){
                                        while(rows.isValidRow()){
                                                if(rows.fieldByName('id') == _selected_obj_id){
                                                        _is_selected = true;
                                                }                                                
                                                var row = Ti.UI.createTableViewRow({
                                                        className:'data_row_'+b,
                                                        title:rows.fieldByName(win.display_name),
                                                        obj_id:rows.fieldByName('id'),
                                                        hasCheck:(rows.fieldByName('id') ==_selected_obj_id)?true:false
                                                });
                                                self.data.push(row);
                                                rows.next();
                                                b++;
                                        }                                
                                }
                                rows.close();
                                db.close();
                                self.table_view.setData(self.data);
                                if(self.data.length <=0){
                                        self.no_result_label.visible = true;
                                }else{
                                        self.no_result_label.visible = false;
                                }     
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _display');
                                return;
                        }
                }
        }

        win.addEventListener('open',function(e){
                try{           
                        Ti.App.Properties.setBool('update_unique_code_with_search_'+win.source+'_view_flag',false); 
                        if(base_select_uniqute_code_from_table_view_with_search_bar_page_obj === null){                                
                                var F = function(){};
                                F.prototype = FieldTeam.prototype;
                                base_select_uniqute_code_from_table_view_with_search_bar_page.prototype = new F();
                                base_select_uniqute_code_from_table_view_with_search_bar_page.prototype.constructor = base_select_uniqute_code_from_table_view_with_search_bar_page;
                                base_select_uniqute_code_from_table_view_with_search_bar_page_obj = new base_select_uniqute_code_from_table_view_with_search_bar_page();
                                base_select_uniqute_code_from_table_view_with_search_bar_page_obj.init();
                        }                        
                }catch(err){
                        alert(err);
                        return;
                }
        });

        win.addEventListener('close',function(e){
                try{                        
                        base_select_uniqute_code_from_table_view_with_search_bar_page_obj.close_window();
                        base_select_uniqute_code_from_table_view_with_search_bar_page_obj = null;
                        win = null;
                }catch(err){
                        alert(err);
                        return;
                }
        });

}());

