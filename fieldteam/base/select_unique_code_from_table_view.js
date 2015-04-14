/**
 *  Description: select unique value from library table (e.g. my_job_priority_code,my_job_quote_status_code)
 */
(function(){
        Titanium.include(Ti.App.Properties.getString('base_folder_name')+'fieldteam.js');
        var win = Titanium.UI.currentWindow;    
        var base_select_uniqute_code_from_table_view_page_obj = null;
        function base_select_uniqute_code_from_table_view_page(){
                var self = this;
                var window_source = 'base_select_uniqute_code_from_table_view_page';
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
                                self.init_vars();
                                //call init_table_view function of parent class: fieldteam.js
                                self.init_table_view();
                                //call init_no_result_label function of parent class: fieldteam.js
                                self.init_no_result_label();
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.init');
                                return;
                        }
                };
                /**
                 *  override init_vars function of parent class: fieldteam.js
                 */                  
                self.init_vars = function(){
                        try{
                                var rows = null;
                                var db = Titanium.Database.open(self.get_db_name());
                                if((win.existed_id_array != null) && (win.existed_id_array != '')){
                                        rows = db.execute('SELECT * FROM '+win.table_name+' WHERE code not in ('+win.existed_id_array+') order by code asc');
                                }else{
                                        rows = db.execute('SELECT * FROM '+win.table_name+' order by code asc');
                                }
                                var b = 0;
                                if(rows.getRowCount() > 0){
                                        while(rows.isValidRow()){
                                                if(rows.fieldByName('code') == _selected_obj_id){
                                                        _is_selected = true;
                                                }
                                                var row = Ti.UI.createTableViewRow({
                                                        className:'data_row_'+b,
                                                        title:rows.fieldByName(win.display_name),
                                                        obj_id:rows.fieldByName('code'),
                                                        hasCheck:(rows.fieldByName('code') == _selected_obj_id)?true:false
                                                });
                                                self.data.push(row);
                                                rows.next();
                                                b++;
                                        }
                                }
                                rows.close();
                                db.close();                                  
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.init_vars');
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
                                        Ti.App.Properties.setBool('update_unique_code_'+win.source+'_view_flag',true); 
                                        Ti.App.Properties.setString('update_unique_code_'+win.source+'_view_id',_selected_obj_id); 
                                        Ti.App.Properties.setString('update_unique_code_'+win.source+'_view_content',_selected_name); 
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
                var _selected_obj_id = win.content;
                var _selected_name = win.content_value;
                var _is_selected = false;
        }

        win.addEventListener('open',function(e){
                try{          
                        Ti.App.Properties.setBool('update_unique_code_'+win.source+'_view_flag',false);  
                        if(base_select_uniqute_code_from_table_view_page_obj === null){                                
                                var F = function(){};
                                F.prototype = FieldTeam.prototype;
                                base_select_uniqute_code_from_table_view_page.prototype = new F();
                                base_select_uniqute_code_from_table_view_page.prototype.constructor = base_select_uniqute_code_from_table_view_page;
                                base_select_uniqute_code_from_table_view_page_obj = new base_select_uniqute_code_from_table_view_page();
                                base_select_uniqute_code_from_table_view_page_obj.init();
                        }
                }catch(err){
                        alert(err);
                        return;
                }                        
        });
    
        win.addEventListener('close',function(e){
                try{                        
                        base_select_uniqute_code_from_table_view_page_obj.close_window();
                        base_select_uniqute_code_from_table_view_page_obj = null;
                        win = null;
                }catch(err){
                        alert(err);
                        return;
                }                        
        });

}());

