/**
 *  Description: team view ,user can see all people's jobs
 */

(function(){
        Titanium.include(Ti.App.Properties.getString('base_folder_name')+'fieldteam.js');
        var win = Titanium.UI.currentWindow;    
        var team_view_page_obj = null;

        function team_view_page(){
                var self = this;
                var window_source = 'team_view_page';
                win.title = 'Team View';

                //public method
                /**
                 *  override init  function of parent class: fieldteam.js
                 */                    
                self.init = function(){
                        try{
                                self.init_auto_release_pool(win);
                                self.data = [];
                                //call init_navigation_bar function of parent class: fieldteam.js
                                self.init_navigation_bar('','Main,Back');     
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
                 *  override init_vars function of parent class: view_list.js
                 */                
                self.init_vars = function(){
                        try{
                                var d = new Date();
                                _calendar_year = d.getFullYear();
                                _calendar_month = d.getMonth();
                                _calendar_date = d.getDate();
                                _calendar_day = d.getDay();
                                var db = Titanium.Database.open(self.get_db_name());
                                var rows = db.execute('SELECT * FROM my_manager_user WHERE company_id=? and status_code=1 and id not in ('+_selected_user_id+') order by display_name',_selected_company_id);
                                var b = 0;
                                if(rows.getRowCount() > 0){
                                        while(rows.isValidRow()){
                                                var row = Ti.UI.createTableViewRow({
                                                        className:'data_row_'+b,
                                                        filter_class:'data_row',
                                                        user_id:rows.fieldByName('id'),
                                                        company_id:rows.fieldByName('company_id'),
                                                        title:rows.fieldByName('display_name')
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
                 *  override table_view_click_event function of parent class: view_list.js
                 */                    
                self.table_view_click_event = function(e){
                        try{
                                var new_win = Ti.UI.createWindow({
                                        url:self.get_file_path('url','team_view/team_view_detail.js'),
                                        user_id:e.source.user_id,
                                        company_id:e.source.company_id,
                                        display_name:e.source.title,
                                        calendar_year:_calendar_year,
                                        calendar_month:_calendar_month,
                                        calendar_date:_calendar_date,
                                        calendar_day:_calendar_day,
                                        calendar_type:_calendar_type,
                                        scroll_view_obj:win.scroll_view_obj
                                });
                                Ti.UI.currentTab.open(new_win,{
                                        animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                });                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.table_view_click_event');
                                return; 
                        }
                };
                
                
                //private member
                var _selected_user_id = Ti.App.Properties.getString('current_login_user_id');
                var _selected_company_id = Ti.App.Properties.getString('current_company_id');
                var _calendar_type = 0;//default type on team view detail, 0://day,1:list,2:month
                var _calendar_year = 0;
                var _calendar_month = 0;
                var _calendar_date = 0;
                var _calendar_day = 0;               
        }

        win.addEventListener('focus',function(){
                try{
                        if(team_view_page_obj === null){
                                var F = function(){};
                                F.prototype = FieldTeam.prototype;
                                team_view_page.prototype = new F();
                                team_view_page.prototype.constructor = team_view_page;
                                team_view_page_obj = new team_view_page();
                                team_view_page_obj.init();
                        }
                }catch(err){
                        alert(err);
                        return;
                }
        });

        win.addEventListener('close',function(){
                try{
                        team_view_page_obj.close_window();  
                        team_view_page_obj = null;
                        win = null;
                }catch(err){
                        alert(err);
                        return;
                }
        });
}());








