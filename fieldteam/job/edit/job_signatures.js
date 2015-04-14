//display job signature
(function(){
        Titanium.include(Ti.App.Properties.getString('base_folder_name')+'fieldteam.js');
        var win = Titanium.UI.currentWindow;
        var job_edit_job_signature_page_obj = null;

        function job_edit_job_signature_page(){
                var self = this;
                var window_source = 'job_edit_job_signature_page';
                win.title = self.ucfirst(win.type)+' Signatures';

                //public method
                /**
                 *  override init  function of parent class: fieldteam.js
                 */                    
                self.init = function(){
                        try{
                                self.init_auto_release_pool(win);
                                self.data = [];
                                //call init_navigation_bar function of parent class: fieldteam.js
                                self.init_navigation_bar('Add','Main,Back');     
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
                 *  override init_vars  function of parent class: fieldteam.js
                 */                    
                self.init_vars = function(){
                        try{
                                var db = Titanium.Database.open(self.get_db_name());                                                                
                                var rows = db.execute('SELECT * FROM my_'+_type+'_signature WHERE status_code=1 and '+_type+'_id=? ORDER BY id desc',_selected_job_id);
                                var b = 0;
                                if(rows.getRowCount() > 0){
                                        while(rows.isValidRow()){
                                                var new_text = '';
                                                new_text+='Client Name : '+rows.fieldByName('client_name')+'\n';
                                                new_text+='Signatured Time : '+rows.fieldByName('time')+'\n';
                                                var new_row = Ti.UI.createTableViewRow({
                                                        className:'data_row_'+b,
                                                        filter_class:'job_signature',
                                                        hasChild:true,
                                                        height:'auto',
                                                        job_id:_selected_job_id,
                                                        job_reference_number:_selected_job_reference_number,
                                                        job_signature_id:rows.fieldByName('id')
                                                });
                                                new_row.add(Ti.UI.createLabel({
                                                        text:new_text,
                                                        textAlign:'left',
                                                        height:'auto',
                                                        width:'auto',
                                                        left:10,
                                                        top:10,
                                                        bottom:10
                                                }));
                                                self.data.push(new_row);
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
                 *  override table_view_click_event  function of parent class: fieldteam.js
                 */                    
                self.table_view_click_event = function(e){
                        try{
                                var signature_win = Ti.UI.createWindow({
                                        url:self.get_file_path('url','job/base/job_signature.js'),
                                        type:_type,
                                        job_id:_selected_job_id,
                                        job_reference_number:_selected_job_reference_number,
                                        job_signature_id:e.row.job_signature_id,
                                        action_for_signature:'edit_job_signature'
                                });
                                Titanium.UI.currentTab.open(signature_win,{
                                        animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                });
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.table_view_click_event');
                                return;
                        }                          
                };
                /**
                 *  override nav_right_btn_click_event  function of parent class: fieldteam.js
                 */                    
                self.nav_right_btn_click_event = function(e){
                        try{
                                var signature_win = Ti.UI.createWindow({
                                        url:self.get_file_path('url','job/base/job_signature.js'),
                                        type:_type,
                                        job_id:_selected_job_id,
                                        job_reference_number:_selected_job_reference_number,
                                        job_signature_id:0,
                                        action_for_signature:'add_job_signature'
                                });
                                Titanium.UI.currentTab.open(signature_win,{
                                        animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                });                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.nav_right_btn_click_event');
                                return;
                        }                        
                };                   
                /**
                 *  display result list
                 */                    
                self.display = function(){
                        try{
                                self.data = [];
                                self.table_view.setData([]);
                                self.init_vars();  
                                if(self.data.length > 0){
                                        self.no_result_label.visible = false;
                                }else{
                                        self.no_result_label.visible = true;
                                }
                                self.table_view.setData(self.data,{
                                        animationStyle:Titanium.UI.iPhone.RowAnimationStyle.DOWN
                                });                                  
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.display');
                                return;
                        }
                };       
                
                //public member
                //self.action_for_job = win.action_for_job;
                var _type = win.type;
                var _selected_job_id = win.job_id;   
                var _selected_job_reference_number = win.job_reference_number;
        }

        win.addEventListener('focus',function(){
                try{
                        if(job_edit_job_signature_page_obj === null){
                                var F = function(){};
                                F.prototype = FieldTeam.prototype;
                                job_edit_job_signature_page.prototype = new F();
                                job_edit_job_signature_page.prototype.constructor = job_edit_job_signature_page;
                                job_edit_job_signature_page_obj = new job_edit_job_signature_page();
                                job_edit_job_signature_page_obj.init();
                        }
                        job_edit_job_signature_page_obj.display();
                }catch(err){
                        alert(err);
                        return;
                }
        });

        win.addEventListener('close',function(){
                try{
                        job_edit_job_signature_page_obj.close_window();
                        job_edit_job_signature_page_obj = null;
                        win = null;
                }catch(err){
                        alert(err);
                        return;
                }
        });    
}());


