/**
 *  Description: date and time picker
 */
(function(){
        Titanium.include(Ti.App.Properties.getString('base_folder_name')+'fieldteam.js');
        var win = Titanium.UI.currentWindow;       
        var job_invoice_operation_time_page_obj = null;
    
        function job_invoice_operation_time_page(){
                var self = this;
                var window_source = 'job_invoice_operation_time_page';
                win.title = 'Operation Date';

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
                                self.init_table_view();
                                _show_date_picker();
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.init');
                                return;
                        }
                };
                /**
                 *  override init_table_view function of parent class: fieldteam.js
                 */                     
                self.init_table_view = function(){
                        try{
                                self.table_view = Ti.UI.createTableView({
                                        data:self.data,
                                        scrollable:false,
                                        style: Ti.UI.iPhone.TableViewStyle.GROUPED,
                                        allowsSelection:true
                                });
                                win.add(self.table_view);
                                self.table_view.selectRow(0);

                                self.table_view.addEventListener('click',function(e){
                                        self.table_view_click_event(e);
                                });                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.init_table_view');
                                return;
                        }
                };
                /**
                 *  override init_vars function of parent class: fieldteam.js
                 */                  
                self.init_vars = function(){
                        try{
                                self.date_row = Ti.UI.createTableViewRow({
                                        title:self.day_list[_calendar_date_day]+', '+_calendar_date_date+' '+self.month_list[_calendar_date_month]+' '+_calendar_date_year,
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size
                                        }
                                });
                                self.data.push(self.date_row);                               
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.init_vars');
                                return;
                        }
                };
                /**
                 *  override table_view_click_event function of parent class: fieldteam.js
                 */                       
                self.table_view_click_event = function(e){
                        try{
                                var index = e.index;
                                switch(index){
                                        case 0:
                                                _show_date_picker();
                                                break;
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.table_view_click_event');
                                return;
                        }                        
                };
                /**
                 *  override nav_right_btn_click_event function of parent class: fieldteam.js
                 */                      
                self.nav_right_btn_click_event = function(e){
                        try{
                                var temp_month = ((_calendar_date_month+1) <=9)?'0'+(_calendar_date_month+1):(_calendar_date_month+1);
                                var temp_date = (_calendar_date_date <=9)?'0'+_calendar_date_date:_calendar_date_date;
                                Ti.App.Properties.setBool('update_job_invoice_operation_time_view_flag',true); 
                                Ti.App.Properties.setString('update_job_invoice_operation_time_view_content',_calendar_date_year+'-'+temp_month+'-'+temp_date);                                                             
                                win.close();
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.nav_right_btn_click_event');
                                return;
                        }
                };                 

                //private member       
                var _calendar_date = null;
                if((win.content == undefined)||(win.content === null)||(win.content == '')){
                        _calendar_date = new Date();
                }else{
                        var calendar_arr = win.content.split('-');                        
                        _calendar_date = new Date(calendar_arr[0],parseInt(calendar_arr[1])-1,calendar_arr[2]);
                }
                var _calendar_date_year = _calendar_date.getFullYear();
                var _calendar_date_month = _calendar_date.getMonth();
                var _calendar_date_date = _calendar_date.getDate();
                var _calendar_date_day = _calendar_date.getDay();
                var _date_picker = null;

                /**
                 * display date picker
                 */
                function _show_date_picker(){
                        try{
                                if(_date_picker != null){
                                        win.remove(_date_picker);
                                        _date_picker = null;
                                }
                                var minDate = new Date();
                                minDate.setFullYear(_calendar_date_year-5);
                                minDate.setMonth(0);
                                minDate.setDate(1);

                                var maxDate = new Date();
                                maxDate.setFullYear(_calendar_date_year+5);
                                maxDate.setMonth(11);
                                maxDate.setDate(31);

                                var value = new Date();
                                value.setFullYear(_calendar_date_year);
                                value.setMonth(_calendar_date_month);
                                value.setDate(_calendar_date_date);

                                _date_picker = Ti.UI.createPicker({
                                        bottom:0,
                                        type:Ti.UI.PICKER_TYPE_DATE,
                                        minDate:minDate,
                                        maxDate:maxDate,
                                        value:value
                                });
                                _date_picker.selectionIndicator = true;
                                _date_picker.setLocale(Titanium.Platform.locale);
                                win.add(_date_picker);
                                                                
                                _date_picker.addEventListener('change',function(e){
                                        self.table_view.selectRow(0);
                                        var newDateValue = new Date(e.value);
                                        _calendar_date_year = newDateValue.getFullYear();
                                        _calendar_date_month = newDateValue.getMonth();
                                        _calendar_date_date = newDateValue.getDate();
                                        _calendar_date_day = newDateValue.getDay();
                                        self.date_row.title = self.day_list[_calendar_date_day]+', '+_calendar_date_date+' '+self.month_list[_calendar_date_month]+' '+_calendar_date_year;
                                });                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _show_date_picker');
                                return;
                        }
                }
        }

        win.addEventListener('open',function(){
                try{
                        Ti.App.Properties.setBool('update_job_invoice_operation_time_view_flag',false); 
                        if(job_invoice_operation_time_page_obj === null){
                                var F = function(){};
                                F.prototype = FieldTeam.prototype;
                                job_invoice_operation_time_page.prototype = new F();
                                job_invoice_operation_time_page.prototype.constructor = job_invoice_operation_time_page;
                                job_invoice_operation_time_page_obj = new job_invoice_operation_time_page();
                                job_invoice_operation_time_page_obj.init();
                        }
                }catch(err){
                        alert(err);
                        return;
                }
        });

        win.addEventListener('close',function(){
                try{
                        job_invoice_operation_time_page_obj.close_window();
                        job_invoice_operation_time_page_obj = null;
                        win = null;
                }catch(err){
                        alert(err);
                        return;
                }
        });
}());









