/**
 *  Function List:
 *  1. Display Client List
 *  2. More Client Button for display more clients
 *  3. Download More Client button for downloading more clients from server
 *  4. Add Client Button
 *  5. Click any client and enter client edit page
 *  6. Search bar
 */
(function(){
        Titanium.include(Ti.App.Properties.getString('base_folder_name')+'fieldteam.js');
        var win = Titanium.UI.currentWindow;    
        var data_cache_page_obj = null;

        function data_cache_page(){
                var self = this;
                var window_source = 'data_cache_page';
                win.title = 'Data Cache Setting';
                     

                //public method
                /**
                 *  override init function of parent class: transaction.js
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
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.init');
                                return;
                        }                 
                };
                self.init_vars = function(){
                        try{     
                                var db = Titanium.Database.open(self.get_db_name());
                                var rows = db.execute('SELECT * FROM my_frontend_config_setting WHERE name=?','data_cache');
                                if((rows != null) && (rows.getRowCount() > 0)){
                                        if(rows.isValidRow()){
                                                _selected_index = parseInt(rows.fieldByName('value'),10);
                                        }
                                }else{
                                        _selected_index = 1;
                                }
                                db.close();
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.init_vars');
                                return;
                        }                            
                };
                /**
                 *  override nav_right_btn_click_event function of parent class: transaction.js
                 */                   
                self.nav_right_btn_click_event = function(){
                        try{
                                var db = Titanium.Database.open(self.get_db_name());
                                var rows = db.execute('SELECT * FROM my_frontend_config_setting WHERE name=?','data_cache');
                                if((rows != null) && (rows.getRowCount() > 0)){
                                        db.execute('UPDATE my_frontend_config_setting SET value=? WHERE name=?',
                                                _selected_index,'data_cache'
                                                ); 
                                }else{
                                        db.execute('INSERT into my_frontend_config_setting (value,name) VALUES('+_selected_index+',\'data_cache\')');                                         
                                }
                                db.close();
                                win.close();
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.nav_right_btn_click_event');
                                return;
                        }                        
                };                     
                /**
                 *  override table_view_click_event function of parent class: transaction.js
                 */                  
                self.table_view_click_event = function(e){
                        try{
                                var index = e.index;
                                var section = e.section;
                                section.rows[index].hasCheck = true;
                                for(var i=0,j=self.data.length;i<j;i++){
                                        if(i != index){
                                                if(section.rows[i] != null){
                                                        section.rows[i].hasCheck = false;
                                                }
                                        }
                                }
                                _selected_index = index+1;
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.table_view_click_event');
                                return;
                        }
                };          
                /**
                 * display client list . Show letter index if client count great than 10
                 */
                self.display = function(){
                        try{
                                var temp_array = ['30 Days','60 Days','90 Days'];                                
                                for(var i=0,j=temp_array.length;i<j;i++){
                                        var row = Ti.UI.createTableViewRow({
                                                title:temp_array[i],
                                                className:'client_class_'+i,
                                                filter_class:'client_class',                                                
                                                hasCheck:((i+1)==_selected_index)?true:false
                                        }); 
                                        self.data.push(row);
                                }     
                                self.table_view.setData(self.data);
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.display');
                                return;
                        }
                };


                //private member
                var _selected_index = 0;
        }

        win.addEventListener('focus',function(e){
                try{                        
                        if(data_cache_page_obj === null){
                                Ti.App.Properties.setBool('select_client_flag',false);
                                var F = function(){};
                                F.prototype = FieldTeam.prototype;
                                data_cache_page.prototype = new F();
                                data_cache_page.prototype.constructor = data_cache_page;
                                data_cache_page_obj = new data_cache_page();
                                data_cache_page_obj.init();
                        }
                        data_cache_page_obj.display();
                }catch(err){
                        alert(err);
                        return;
                }
        });

        win.addEventListener('close',function(){
                try{
                        data_cache_page_obj.close_window();
                        data_cache_page_obj = null;                        
                        win = null;
                }catch(err){
                        alert(err);
                        return;
                }
        });
}());

