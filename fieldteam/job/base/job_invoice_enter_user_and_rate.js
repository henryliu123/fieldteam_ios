/**
 *  Description: job query field and user can enter query value
 */

(function(){
        Titanium.include(Ti.App.Properties.getString('base_folder_name')+'fieldteam.js');
        var win = Titanium.UI.currentWindow;    
        var job_invoice_enter_user_and_rate_page_obj = null;

        function job_invoice_enter_user_and_rate_page(){
                var self = this;
                var window_source = 'job_invoice_enter_user_and_rate_page';
                win.title = win.title_value;

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
                                _init_user_name_text_field();
                                _init_user_rate_text_field();
                                //call init_table_view function of parent class: fieldteam.js
                                self.init_table_view();
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.init');
                                return; 
                        }
                };
                /**
                 *  override nav_right_btn_click_event function of parent class: transaction.js
                 */                    
                self.nav_right_btn_click_event = function(e){
                        try{
                                var errorMessage = '';
                                if(self.trim(_username) === ''){
                                        errorMessage += 'Please enter username.';
                                }   
                                if(isNaN(parseFloat(_rate))){
                                        if(errorMessage != ''){
                                                errorMessage+='\n';
                                        }
                                        errorMessage += 'Wrong currency format.\n (e.g '+_selected_currency+'123.45)';                                  
                                }else{
                                        if(!self.check_valid_price(_rate)){
                                                if(errorMessage != ''){
                                                        errorMessage+='\n';
                                                }
                                                errorMessage += 'Wrong currency format.\n (e.g '+_selected_currency+'123.45)';                                                  
                                        }                                         
                                }        
                                if(errorMessage != ''){
                                        self.show_message(errorMessage);
                                        return;
                                }
                                if(e.index == self.default_main_menu_button_index){//menu menu
                                        self.close_all_window_and_return_to_menu(); 
                                }else{
                                        Ti.App.Properties.setBool('job_invoice_enter_username_flag',true);
                                        Ti.App.Properties.setString('job_invoice_enter_username_content',_username);
                                        Ti.App.Properties.setString('job_invoice_enter_rate_content',_rate);
                                        win.close();
                                }                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.nav_right_btn_click_event');
                                return;
                        }
                };        

                //private member      
                var _username = win.username;
                var _rate = win.rate;
                var _selected_currency = self.get_selected_currency();
                //private method
                function _init_user_name_text_field(){
                        try{
                                var row = Ti.UI.createTableViewRow({
                                        className:'data_row',
                                        header:'Name'
                                });
                                self.query_field = Ti.UI.createTextField({
                                        height:20,
                                        paddingLeft:10,
                                        width:(self.is_ipad()?self.screen_width-80:self.screen_width-20),
                                        value:_username,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        },
                                        autocapitalization:Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
                                        keyboardType: Titanium.UI.KEYBOARD_DEFAULT,
                                        clearButtonMode:Titanium.UI.INPUT_BUTTONMODE_ONFOCUS
                                });
                                row.add(self.query_field);
                                self.data.push(row);
                                self.query_field.addEventListener('change',function(e){
                                        _username = e.value;
                                });
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_user_name_text_field');
                                return; 
                        }
                }
                function _init_user_rate_text_field(){
                        try{
                                var row = Ti.UI.createTableViewRow({
                                        className:'data_row',
                                        header:'Rate'
                                });
                                self.rate_field = Ti.UI.createTextField({
                                        height:20,
                                        paddingLeft:10,
                                        width:(self.is_ipad()?self.screen_width-80:self.screen_width-20),
                                        value:_selected_currency+self.currency_formatted(parseFloat(_rate)),
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        },
                                        autocapitalization:Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
                                        keyboardType:Titanium.UI.KEYBOARD_DECIMAL_PAD,
                                        clearButtonMode:Titanium.UI.INPUT_BUTTONMODE_ONFOCUS
                                });
                                row.add(self.rate_field);
                                self.data.push(row);
                                self.rate_field.addEventListener('change',function(e){
                                        var temp_rate = (e.value == '')?'':e.value.replace(_selected_currency,'');
                                        _rate = temp_rate;                                        
                                });
                                self.rate_field.addEventListener('blur',function(e){
                                        self.rate_field.value = _selected_currency+self.currency_formatted(parseFloat(_rate));                                        
                                });                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_user_rate_text_field');
                                return; 
                        }
                }                
        }

        win.addEventListener('open',function(){
                try{
                        if(job_invoice_enter_user_and_rate_page_obj === null){
                                var F = function(){};
                                F.prototype = FieldTeam.prototype;
                                job_invoice_enter_user_and_rate_page.prototype = new F();
                                job_invoice_enter_user_and_rate_page.prototype.constructor = job_invoice_enter_user_and_rate_page;
                                job_invoice_enter_user_and_rate_page_obj = new job_invoice_enter_user_and_rate_page();
                                job_invoice_enter_user_and_rate_page_obj.init();
                                job_invoice_enter_user_and_rate_page_obj.query_field.focus();
                        }
                }catch(err){
                        alert(err);
                        return;
                }
        });

        win.addEventListener('close',function(){
                try{
                        job_invoice_enter_user_and_rate_page_obj.close_window();
                        job_invoice_enter_user_and_rate_page_obj = null;
                        win = null;
                }catch(err){
                        alert(err);
                        return;
                }
        });
}());








