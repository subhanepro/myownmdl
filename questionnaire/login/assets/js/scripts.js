$(document).ready(function () {
    $('.phone_us').mask('(000) 000-0000');
    
    //formatting number to currency
    Number.prototype.formatMoney = function(c, d, t){
        var n = this, 
        c = isNaN(c = Math.abs(c)) ? 2 : c, 
        d = d == undefined ? "." : d, 
        t = t == undefined ? "," : t, 
        s = n < 0 ? "-" : "", 
        i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))), 
        j = (j = i.length) > 3 ? j % 3 : 0;
       return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
    };    
    $( ".money2" ).each(function( index ) {
        var thisNum =  parseInt($( this ).text());
        $( this ).text((thisNum).formatMoney(2, '.', ','));
    });
    

    
    //$('.datepicker').datepicker({ dateFormat: 'm/d/yy' });
    $('body').on('click','.datepicker', function() {
        $(this).datepicker('destroy').datepicker({showOn:'focus',dateFormat: 'm/d/yy'}).focus();
    });
    $('body').delegate( ".numberonly", "input", function() {       
        var val = $(this).val(); 
        $(this).val(val.replace(/\D/g,''));
    });
   
    $( "form" ).submit(function( event ) {
        if ($(".f2").hasClass('error')) {
            event.preventDefault();
            $('#message').html("Please fix all errors.");
        } else {
            return;
        }
    });
    
    /**
     * Home page toggle for search sidebar
     */
    $("#action_palette_toggle").click(function(){
        //Changes the width of the filters
        $("#action_palette").toggleClass("action_palette_width");
        //Changes the width of the table
        $("main").toggleClass("wider-main");
        $("#dataTableHome thead").toggleClass("wider-bar");
        $("#dataTableHome tbody").toggleClass("wider-tbody");
        $(".bottom").toggleClass("wider-bottom");

        //Moves the toggle left and right
        $(this).toggleClass("toggle_move");

        $("#palette_top .submit").toggleClass("smaller_button")

        $("#palette_top").toggleClass("shorter_palette_top");
        $(".formContent").toggleClass("form-remove");

        //Flips the toggle arrow
        if($("#action_palette_toggle i").hasClass("fa-angle-left")){
            $("#action_palette_toggle i").removeClass('fa-angle-left').addClass('fa-angle-right');
        }else{
            $("#action_palette_toggle i").removeClass('fa-angle-right').addClass('fa-angle-left');
        }

            
    });
    
    
    
    $("#selectAllPrintOptions").change(function() {
        if(this.checked) {
            $('.printSelectBlock .print1').prop('checked', true);
            //$('#switchLabel').text('Remove All').css('margin-left', '-40px');
            $('#switchLabel').text('Remove All');
        }else{
            $('.printSelectBlock .print1').prop('checked', false);
            //$('#switchLabel').text('Select All').css('margin-left', '-32px');;
            $('#switchLabel').text('Select All');
        }
    });
    
    $('.closeModal').on('click', function(e){
        e.preventDefault();
        $('.modalBlock').removeClass('show').addClass('hide');
    });
    
    /**
     *  When Location Selected Web
     *  disable Pin checkbox and set Password to checked
     */
    $('#url-config-settings #location').on('change', function() {
        var location = this.value;
        if(location=='W'){
            $('#url-config-settings #pin').prop('checked', false);
            $('#url-config-settings #pass').prop('checked', true);
            $("#url-config-settings #pin").prop("disabled", true);
        } else {
            $("#url-config-settings #pin").prop("disabled", false);
        }
    });
    /**
     * account dropdown on change function
     * update account info when account selected
     */
    $('#url-config-settings #account').on('change', function() {
        var accountId =  this.value;
        //console.log(accountId);
        var ajaxUrl = baseUrl+'/ajaxHandler.php';
        $.ajax( ajaxUrl , {
            type: 'POST',
            data: {
               get_account_info: '1',
               account_id: accountId
            },
            success: function(response) {
                var result = JSON.parse(response);
                //console.log(result);
                var accountData = result['accountInfo'];
                var providers = result['providers']
                updateAccountInfo(accountData['0'], providers);
            },
            error: function() {
                console.log('0');
            }
        });
    });
    
    /**
     * Homepage Filter 
     * Account-Provider-Salesrep dropdown change
     */
        
    $("#filter_form #account, #filter_form #provider, #filter_form #salesrep").on('change', function() {
        var thisName = this.name;
        var accountVal  = $('#filter_form #account').val();        
        var providerVal = $('#filter_form #provider').val();
        var salesRepVal = $('#filter_form #salesrep').val();
        
         
        var ajaxUrl = baseUrl+'/ajaxHandler.php';
        $.ajax( ajaxUrl , {
            type: 'POST',
            data: {
                get_account_correlations: thisName, 
                id: this.value,
                account: accountVal,
                provider: providerVal,
                salesRep: salesRepVal
            },
            success: function(response) {
                var result = JSON.parse(response);  
                console.log(result);
                
                if(result.name == 'account' ){ 
                    if( (providerVal=="" && salesRepVal=="") || accountVal == "" ) {
                        updateCorrelations(result.accounts_html, result.provider_html, result.salesrep_html);
                    }
                }
                
                if(result.name == 'provider'){                    
                    //updateCorrelations("",  result.provider_html, "");
                    if(accountVal=="" && salesRepVal==""){
                        updateCorrelations(result.accounts_html,  result.provider_html, "");
                        if(salesRepVal == ""){
                            updateCorrelations("", "", result.salesrep_html);
                        }
                    }
                    
                }
                if(result.name == 'salesrep'){
                    //updateCorrelations("",  "", result.salesrep_html); 
                    if(accountVal == "" && providerVal == ""){
                        updateCorrelations(result.accounts_html,  "",  result.salesrep_html);
                        if(providerVal == ""){
                            updateCorrelations("",  result.provider_html,  result.salesrep_html);
                        }
                    }
                    
                }  
                
                if(accountVal==""){ $("#filter_form #account").addClass('no-selection'); }else{$("#filter_form #account").removeClass('no-selection');}
                if(providerVal==""){ $("#filter_form #provider").addClass('no-selection'); }else{$("#filter_form #provider").removeClass('no-selection');}
                if(salesRepVal==""){ $("#filter_form #salesrep").addClass('no-selection'); }else{$("#filter_form #salesrep").removeClass('no-selection');}

            },
            error: function() {
                console.log('0');
            }
        });        
    });
    
    function updateCorrelations(accounts_html, provider_html, salesrep_html){
        if(accounts_html!=""){
            $("#filter_form #account").empty();
            $("#filter_form #account").removeClass('no-selection');
            $("#filter_form #account").parent().parent().removeClass('show-label valid');
            $("#filter_form #account").append(accounts_html);
        }
        if(provider_html!=""){
            $("#filter_form #provider").empty();
            $("#filter_form #provider").removeClass('no-selection');
            $("#filter_form #provider").parent().parent().removeClass('show-label valid');
            $("#filter_form #provider").append(provider_html);
        }
        if(salesrep_html!=""){
            $("#filter_form #salesrep").empty();        
            $("#filter_form #salesrep").removeClass('no-selection');
            $("#filter_form #salesrep").parent().parent().removeClass('show-label valid');
            $("#filter_form #salesrep").append(salesrep_html);
        }
       
    }
    
    $("#filter_form #account--, #filter_form #provider--, #filter_form #salesrep--").on('change', function() {
        var thisName = this.name;
        var accountVal  = $('#filter_form #account').val();        
        var providerVal = $('#filter_form #provider').val();
        var salesRepVal = $('#filter_form #salesrep').val();
        
        accountVal = (accountVal)?accountVal:'none';
        providerVal = (providerVal)?providerVal:'none';
        salesRepVal = (salesRepVal)?salesRepVal:'none';
      
        var ajaxUrl = baseUrl+'/ajaxHandler.php';
        $.ajax( ajaxUrl , {
            type: 'POST',
            data: {
                get_account_correlations: thisName, 
                id: this.value,
                account: accountVal,
                provider: providerVal,
                salesRep: salesRepVal
            },
            success: function(response) {
                var result = JSON.parse(response);  
                console.log(result);
                
                if(result.name == 'account' ){ // || salesRepVal == 'none' || providerVal=='none'
                    $("#provider, #salesrep").empty();
                    $("#provider").append(result.provider_html);
                    $("#salesrep").append(result.salesrep_html);
                    if(accountVal=='none'){
                        $("#provider, #salesrep").empty();
                        $("#provider").append(result.provider_html);
                        $("#salesrep").append(result.salesrep_html);
                        $('#filter_form #provider, #filter_form #salesrep').parent().parent().removeClass('show-label valid'); 
                        $('#filter_form #provider, #filter_form #salesrep').addClass('no-selection').val('').attr("selected", "selected");                        
                    } 
                }
                
                if(result.name == 'provider'){
                    if(providerVal == 'none'){
                        $('#filter_form #account').parent().parent().removeClass('show-label valid'); 
                        $('#filter_form #account').addClass('no-selection').val('').attr("selected", "selected");                        
                        $("#provider, #salesrep").empty();
                        $("#provider").append(result.provider_html);
                        $("#salesrep").append(result.salesrep_html);
                    } else {
                        $('#filter_form #account').parent().parent().addClass('show-label valid');
                        $('#filter_form #account').val(result.accountID).attr("selected", "selected");
                    }                    
                    $('#filter_form #provider').val(result.providerID).attr("selected", "selected");
                    if(!salesRepVal || salesRepVal==''){
                        $("#provider, #salesrep").empty();
                        $("#provider").append(result.provider_html);
                        $("#salesrep").append(result.salesrep_html);
                    }
                }
                if(result.name == 'salesrep'){
                    if(accountVal == 'none'){
                        $('#filter_form #account').parent().parent().addClass('show-label valid');
                        $('#filter_form #account').val(result.accountID).attr("selected", "selected");
                    }                    
                    $('#filter_form #salesrep').val(result.salesRepID).attr("selected", "selected");
                    if(!providerVal || providerVal==''){
                        $("#provider, #salesrep").empty();
                        $("#provider").append(result.provider_html);
                        $("#salesrep").append(result.salesrep_html);
                    }
                }  
                
            },
            error: function() {
                console.log('0');
            }
        });        
    });
    
    
    
    /**
     * Update Account info and providers 
     * @param {type} accountData
     * @param {type} providers
     * @returns 
     */
    function updateAccountInfo(accountData, providers){
        var officeLogo = accountData['logo'];
        if(officeLogo){
            setImage('#officeLogo', 'width="100"', officeLogo);
        } else {
            setImage('#officeLogo', 'width="100"', "default.png", "assets/images/");
        }
         var account = accountData['account'];
        var name = accountData['name'];
        var address = accountData['address'];
        var state = accountData['state'];
        var city = accountData['city'];
        var zip = accountData['zip'];
        $('#officeAddress, #officeAddressLabel').html("");
        
        //$('#officeAddressLabel').prepend('Address');
        //$('#officeAddress').prepend(address+"<br/>"+city+", "+state+" "+zip);
            
        var addressInfo = "";
        if(address || city){
            $('#officeAddressLabel').prepend(account+" "+capitalizeWord(name,true)); 
            addressInfo += "<div>";
            
            if(address){
                addressInfo += address+"<br/>";
            }
            if(city){
               addressInfo += city; 
               if(state || zip){
                   addressInfo += ", ";
               }
            }
            if(state){
                addressInfo += state;
            }
            if(zip){
                addressInfo += " " + zip;
            }
            addressInfo += "</div>";
        }
        if(accountData['phone_number']){
            addressInfo += "<div><i class='fas fa-phone'></i> <a class='phone_us' href='tel:"+accountData['phone_number']+"'>"+accountData['phone_number']+"</a></div>";
        }
        if(accountData['fax']){
            addressInfo += "<div><i class='fas fa-fax'></i> <a class='phone_us' href='tel:"+accountData['fax']+"'>"+accountData['fax']+"</a></div>";
        }
        if(accountData['website']){
            addressInfo += "<div><i class='fas fa-globe'></i> <a target='_blank' href='"+accountData['website']+"'>"+accountData['website']+"</a></div>";
        }
        $('#officeAddress').prepend(addressInfo);  
        
        $('#physiciansList, #physiciansListLabel').html("");
        for ( var i=0; i<providers.length; i++){
            $('#physiciansList').append('<p>'+providers[i]['first_name']+" "+providers[i]['last_name']+", "+providers[i]['title']+'</p>');
        }
        $('#physiciansListLabel').append('<p class="providersTitle">Health Care Providers</p>');

    }
    
    /**
     *  Generate Url button on click foncion
     */
    $('.url_config').on('click', function (event) {      
        var id = $(this).attr('id');        
        $.ajax( 'ajaxHandler.php', {
            type: 'POST',
            data: {
               url_config: '1',
               id: id
            },
            success: function(response) {
                var result = JSON.parse(response);
                var configData = result.urlConfigs[0];
                //console.log(configData);
                updateSelectSettings(configData);
            },
            error: function() {
                console.log('0');
            }
        });
    });
    
    /**
     * update Selected Settings function
     * @param {type} configData
     * @returns 
     */
    function updateSelectSettings(configData){
        //console.log(configData);
        var configDataId = configData['id'];
        var account = configData['account'];
        var location = configData['code'];
        var genevedaLogo = configData['geneveda'];
        var accountName = configData['name'];
        var pin = configData['pin'];
        var deviceId = configData['device_id'];
        var officeLogo = configData['logo'];
        
        if(genevedaLogo=='1'){
            $('#url-config-settings #geneveda').prop('checked', true);
        } else {
            $('#url-config-settings #mdl').prop('checked', true);
        }
        if(pin=='1'){
            $('#url-config-settings #pin').prop('checked', true);
        } else if (pin=='2') {
            $('#url-config-settings #noemail').prop('checked', true);
        } else {
            $('#url-config-settings #pass').prop('checked', true);
        }
        setSelectedAttrByVal('#url-config-settings #account option', account);
        setSelectedAttrByVal('#url-config-settings #location option', location);
        setSelectedAttrByVal('#url-config-settings #deviceId option', deviceId);
        if(officeLogo){
            setImage('#officeLogo', 'width="100"', officeLogo);
        } else {
            setImage('#officeLogo', 'width="100"', "default.png", "assets/images/");
        }
        if(account !== null){
            var account = configData['account'];
            var name = configData['name'];
            var address = configData['address'];
            var state = configData['state'];
            var city = configData['city'];
            var zip = configData['zip'];
            
            $('#officeAddress, #officeAddressLabel').html("");  
            var addressInfo = "";
            if(address || city){
                $('#officeAddressLabel').prepend(account+" "+capitalizeWord(name,true)); 
                addressInfo += "<div>";
                if(address){
                    addressInfo += address+"<br/>";
                }
                if(city){
                   addressInfo += city; 
                   if(state || zip){
                       addressInfo += ", ";
                   }
                }
                if(state){
                    addressInfo += state;
                }
                if(zip){
                    addressInfo += " " + zip;
                }
                addressInfo += "</div>";
            }
            
            if(configData['phone_number']){
                addressInfo += "<div><i class='fas fa-phone'></i> <a class='phone_us' href='tel:"+configData['phone_number']+"'>"+configData['phone_number']+"</a></div>";
            }
            if(configData['fax']){
                addressInfo += "<div><i class='fas fa-fax'></i> <a class='phone_us' href='tel:"+configData['fax']+"'>"+configData['fax']+"</a></div>";
            }
            if(configData['website']){
                addressInfo += "<div><i class='fas fa-globe'></i>  <a target='_blank' href='"+configData['website']+"'>"+configData['website']+"</a></div>";
            }
            $('#officeAddress').prepend(addressInfo);        
            $('#physiciansList, #physiciansListLabel').html("");  

            $.ajax( 'ajaxHandler.php', {
                type: 'POST',
                data: {
                   get_providers: '1',
                   accountId: account
                },
                success: function(response) {
                    var result = JSON.parse(response);
                    var providers = result['providers'];
                    for ( var i=0; i<providers.length; i++){
                        $('#physiciansList').append('<p>'+providers[i]['first_name']+" "+providers[i]['first_name']+", "+providers[i]['title']+'</p>');
                    }
                    $('#physiciansListLabel').append('<p class="providersTitle">Health Care Providers</p>');

                },
                error: function() {
                    console.log('0');
                }
             });
            } else{
               $('#officeLogo').html("");
               $('#officeAddress, #officeAddressLabel').html("");
               $('#physiciansList, #physiciansListLabel').html(""); 
            }
        
    }
    
    /**
     * Set dropdown option selected
     * @param {type} selector
     * @param {type} matchValue
     * @returns 
     */
    function setSelectedAttrByVal(selector, matchValue){
        $(selector).removeAttr('selected');  
        $(selector).each(function(index,value) {
            if($(this).val() == matchValue){
                $(this).attr('selected','selected');
            } else {
                $(this).removeAttr('selected');
            }
        });
    }
    
    /**
     * Set image to given selecoto container
     * @param {type} selectorDiv
     * @param {type} attr
     * @param {type} imageName
     * @returns 
     */
    function setImage(selectorDiv, attr, imageName, uploadUrl=""){
        if(uploadUrl==""){
            uploadUrl = baseUrl+"/../images/practice/";
        }
        $(selectorDiv).html("");
        $(selectorDiv).prepend('<img '+attr+' src="'+uploadUrl+imageName+'" />')
    }
    
    
    // Setup - add a text input to each footer cell
    
    
    
    //$('#dataTable thead tr').clone(true).appendTo( '#dataTable thead' );
    $('#dataTable thead tr:eq(0) th').each( function (i) {
        if( !$(this).hasClass('noFilter') ){
            var title = $(this).text();
            $(this).html( '<input class="dataTableFilterInput" type="text" placeholder="'+title+'" />' );

            $( 'input', this ).on( 'keyup change', function () {
                if ( table.column(i).search() !== this.value ) {
                    table
                        .column(i)
                        .search( this.value )
                        .draw();
                }
            } );
        } 
    } );
    //don't sort tabel column on click to this input
    $('.dataTableFilterInput').on('click', function (e) {
         e.stopPropagation();
    });
    
    $('#accounts #selectAccount').on('change', function() {
        var accountId =  this.value;
        var accountGuid = $(this).find(':selected').attr('data-guid');
        var accountUrl = baseUrl+"/accounts.php?account_id="+accountGuid;
        window.location = accountUrl;
    });
 
 
    $('#accounts #selectAccount__').on('change', function() {
        var accountId =  this.value;
        $.ajax( 'ajaxHandler.php', {
            type: 'POST',
            data: {
               get_account_full_info: '1',
               account_id: accountId
            },
            success: function(response) {
                var result = JSON.parse(response);
                console.log(result);
                var accountData = result['accountInfo'];
                var providers = result['providers']
                updateAccountFullInfo(accountData['0'], providers);
            },
            error: function() {
                console.log('0');
            }
        });
    });
    function updateAccountFullInfo(accountData, providers){
        
        var dataEditUrl = $("#edit-selected-account").attr("data-edit-url");
        $("#edit-selected-account").attr("href", dataEditUrl+accountData['Guid_account']);
        
        var officeLogo = accountData['logo'];
        setImage('#officeLogo', 'class="salesrepLogo"', officeLogo);
        var address = accountData['address'];
        var state = accountData['state'];
        var city = accountData['city'];
        var zip = accountData['zip'];
        var site = accountData['website'];
        var phone = accountData['phone_number'];       
 
        $('#officeAddress, #salesrepInfo1').html("");
        var addressInfo = address+"<br/>"+city+", "+state+" "+zip;
        addressInfo += "<div><a class='phone_us' href='tel:"+phone+"'>"+phone+"</a></div>";
        addressInfo += "<div><a href='"+site+"'>"+site+"</a></div>";
        $('#officeAddress').prepend(addressInfo);
        
        var salesrepAddrInfo = accountData['salesrepRegion']+"<br/>"+accountData['salesrepAddress']+"<br/>"+accountData['salesrepCity']+", "+accountData['salesrepState']+" "+accountData['salesrepZip'];
        salesrepAddrInfo += "<div><a href='mailto:"+accountData['salesrepEmail']+"'>"+accountData['salesrepEmail']+"</a></div>";
        salesrepAddrInfo += "<div><a class='phone_us'  href='"+accountData['salesrepPhone']+"'>"+accountData['salesrepPhone']+"</a></div>";
        $('#salesrepInfo1').prepend(salesrepAddrInfo);
        //salesrepPhoto
        
        $('#salesrepInfo2 .pic, #salesrepInfo2 .name').html("");
        setImage('#salesrepInfo2 .pic', 'class="salesrepProfilePic"', accountData['salesrepPhoto']);
        $('#salesrepInfo2 .name').prepend(accountData['salesrepFName']+" "+accountData['salesrepLName']);
        
        var providersInfo = "";
        for(var i=0; i<providers.length; i++ ){           
            providersInfo += "<tr>";
            providersInfo += "<td>"+providers[i]['Guid_provider']+"</td>";
            providersInfo += "<td>"+providers[i]['title']+"</td>";
            providersInfo += "<td>"+providers[i]['first_name']+"</td>";
            providersInfo += "<td>"+providers[i]['last_name']+"</td>";
            providersInfo += "<td><img width=30' src='uploads/"+providers[i]['photo_filename']+"'></td>";
            providersInfo += "<td class='text-center'><a class='edit-provider' data-provider-guid='"+providers[i]['Guid_provider']+"'><span class='glyphicon glyphicon-pencil' aria-hidden='true'></span></a>";
            providersInfo += " <a href=''><span class='glyphicon glyphicon-trash' aria-hidden='true'></span></a></td>";
            providersInfo += "</tr>";
        }
        $('.providersTable tbody').html(" ");
        $('.providersTable tbody').prepend(providersInfo);
    } 
       
    $("#add-account-provider").on('click', function (){
        $("#add-account-provider-box").removeClass("hide");
        $(".providersTitle").html("Add Provider");
        //remove input values
        $("#add-account-provider-box form input").val("");
        $("#add-account-provider-box form #profile-pic").html("");        
    });
    
    
    //specimen checkbox actions
    $('#specimen input').on('click', function() {
        var specimen = this.value;
        console.log(specimen);
        if(specimen=='No'){
            $('#select-reson').removeClass('hidden');
            $('#pLogs, #mdlInfoBox').addClass('hidden');
        } 
        if(specimen=='Yes'){
            $('#select-reson, #specimenRadioBox').addClass('hidden');
            $('#pLogs, #mdlInfoBox').removeClass('hidden');
        }
    });
    
    //edit_text
    $('.edit_text').on('click', function() {
        var original_text = $(this).parent().find('.editable_text').text();
        var new_input = $("<input type=\"email\" name=\"email\" class=\"text_editor\"/>");
        new_input.val(original_text);
        $(this).parent().find('.editable_text').replaceWith(new_input);
        //new_input.focus();
    });
    $('.edit_this_text').on('click', function() {
        var original_text = $(this).parent().find('.editable_text').text();
        var name = $(this).attr('data-name');
        var className = $(this).attr('data-class');
        var new_input = $("<input  autocomplete=\"off\" type=\"text\" name=\""+name+"\" class=\"text_editor "+className+"\"/>");
        new_input.val(original_text);
        $(this).parent().find('.editable_text').replaceWith(new_input);
        //new_input.focus();
    });
    
    //edit revinue item
    $('.edit_reveue').on('click', function() {
        var dataID = $(this).attr('data-id');
        
        var datePaydTxt = $('#revenue-table #'+dataID+" .editable_date_payd").text();
        var datePayorTxt = $('#revenue-table #'+dataID+" .editable_payor").text();
        var dateAmmountTxt = $('#revenue-table #'+dataID+" .editable_amount").text();
        
        var datePaydInput = $("<input required autocomplete=\"off\" type=\"text\" name=\"revenueEdit["+dataID+"][date_paid]\" class=\"datepicker\" />");
        var datePayorInput = $("<input required autocomplete=\"off\" type=\"text\" name=\"revenueEdit["+dataID+"][payor]\" />");
        var dateAmountInput = $("<input required autocomplete=\"off\" type=\"text\" name=\"revenueEdit["+dataID+"][amount]\" class=\"numberonly\" />");
        
        datePaydInput.val(datePaydTxt);
        datePayorInput.val(datePayorTxt);
        dateAmountInput.val(dateAmmountTxt);
        
        $('#revenue-table #'+dataID+" .editable_date_payd").replaceWith(datePaydInput);
        $('#revenue-table #'+dataID+" .editable_payor").replaceWith(datePayorInput);
        $('#revenue-table #'+dataID+" .editable_amount").replaceWith(dateAmountInput);
        
        $('#revenue-table #'+dataID+" .action_second").removeClass('hide');
        $('#revenue-table #'+dataID+" .action_first").addClass('hide');
        
    });
    
    //edit deductable item
    $('.edit_deductable').on('click', function() {
        var dataID = $(this).attr('data-id');
        
        var dateCheckedTxt = $('#deductable-table #'+dataID+" .editable_date_checked").text();
        var checkedByTxt = $('#deductable-table #'+dataID+" .editable_checked_by").text();
        var deductableTxt = $('#deductable-table #'+dataID+" .editable_deductable").text();
        console.log(dateCheckedTxt);
        var dateCheckedInput = $("<input required autocomplete=\"off\" type=\"text\" name=\"deductableEdit["+dataID+"][date_checked]\" class=\"datepicker\" />");
        var checkedByInput = $("<input required autocomplete=\"off\" type=\"text\" name=\"deductableEdit["+dataID+"][checked_by]\" />");
        var deductableInput = $("<input required autocomplete=\"off\" type=\"text\" name=\"deductableEdit["+dataID+"][deductable]\" class=\"numberonly\" />");
        
        dateCheckedInput.val(dateCheckedTxt);
        checkedByInput.val(checkedByTxt);
        deductableInput.val(deductableTxt);
        
        $('#deductable-table #'+dataID+" .editable_date_checked").replaceWith(dateCheckedInput);
        $('#deductable-table #'+dataID+" .editable_checked_by").replaceWith(checkedByInput);
        $('#deductable-table #'+dataID+" .editable_deductable").replaceWith(deductableInput);
        
        //$('#deductable-table #'+dataID+" .action_second").removeClass('hide');
        //$('#deductable-table #'+dataID+" .action_first").addClass('hide');
        
    });   
    
    $('#add-revenue').on('click', function(){
        console.log('here');
        $('.revenue-form').html();
        var formData = '<table class="table"><tr>\n\
                        <td><input name="revenueAdd[date_paid]" class="deductable-first datepicker" autocomplete="off" class="revenue-first" placeholder="Date Paid" type="text" /></td>\n\
                        <td><input name="revenueAdd[payor]" placeholder="Payor" type="text" /></td>\n\
                        <td><input name="revenueAdd[amount]" class="numberonly"  placeholder="Amount $" type="text" /></td>\n\
                        </tr></table>';
        $('.revenue-form').html(formData);
    });
    $('#add-deductable-log').on('click', function(){
        $('.deductable-form').html();
        var formData = '<table class="table"><tr>\n\
                            <td><input required="" name="deductableAdd[date_checked]" class="deductable-first datepicker" autocomplete="off" placeholder="Date Checked" type="text" /></td>\n\
                            <td><input required="" name="deductableAdd[checked_by]" placeholder="Checked By" type="text" /></td>\n\
                            <td><input required="" name="deductableAdd[deductable]" class="numberonly"  placeholder="Deductable $" type="text" /></td>\n\
                        </tr></table>';
        
        $('.deductable-form').html(formData);
    });
    
    
    
});

/***
 * not working for iPad
 * check this option
 */
$(document).click(function(e) { 

    var ele = $(e.toElement); 
    if (!ele.hasClass("hasDatepicker") && !ele.hasClass("ui-datepicker") && !ele.hasClass("ui-icon") && !$(ele).parent().parents(".ui-datepicker").length)
       $(".hasDatepicker").datepicker("hide"); 
});


/**
 *  Confirmation functions for delete items
 * @param {type} anchor
 * @returns {undefined}
 */
function confirmationDelete(anchor){
    $str = anchor.attr("href").split("&");
    $str = $str[1].split("="); 
    var conf = confirm('Are you sure you want to delete setting #'+$str[1]+'?');   
    if(conf)  window.location=anchor.attr("href");
}
function confirmationDeleteDevice(anchor){
    $str = anchor.attr("href").split("&");
    $str = $str[1].split("="); 
    var conf = confirm('Are you sure you want to delete device with Serial #'+$str[1]+'?');   
    if(conf)  window.location=anchor.attr("href");
}
function confirmationDeleteAccount(anchor){
    $str = anchor.attr("href").split("&");
    $str = $str[1].split("="); 
    var conf = confirm('Are you sure you want to delete account #'+$str[1]+'?');   
    if(conf)  window.location=anchor.attr("href");
}
function confirmationDeleteSalesReps(anchor){
    $str = anchor.attr("href").split("&");
    $str = $str[1].split("="); 
    var conf = confirm('Are you sure you want to delete Salesrep #'+$str[1]+'?');   
    if(conf)  window.location=anchor.attr("href");
}
function confirmationDeleteProvider(anchor){    
    $str = anchor.attr("href").split("&");
    $str = $str[1].split("=");    
    var conf = confirm('Are you sure you want to delete provider #'+$str[1]+'?');   
    if(conf)  window.location=anchor.attr("href");
}
function confirmationDeleteDeductible(anchor){    
    $str = anchor.attr("href").split("&");
    $str = $str[1].split("=");    
    var conf = confirm('Are you sure you want to delete Deductible Log #'+$str[1]+'?');   
    if(conf)  window.location=anchor.attr("href");
}
function confirmationDeleteRevenue(anchor){
    $str = anchor.attr("href").split("&");
    $str = $str[1].split("=");    
    var conf = confirm('Are you sure you want to delete Revenue #'+$str[1]+'?');   
    if(conf)  window.location=anchor.attr("href");
}



/**
 *  After upload show image in thumbnail 
 *  edd/edt pages for accunts, providers etc
 * @returns {undefined}
 */
var fileInput =  document.getElementById("file");
if (typeof(fileInput) != 'undefined' && fileInput != null)
{
    document.getElementById("file").onchange = function () {
        var reader = new FileReader();

        reader.onload = function (e) {
            // get loaded data and render thumbnail.
            document.getElementById("image").src = e.target.result;
        };

        // read the image file as a data URL.
        reader.readAsDataURL(this.files[0]);
    };
}

/**
 *  JS history back for Cancel buttons
 * @returns {undefined}
 */
function goBack() {
    window.history.back()
}
/**
 *  Capitalize first letter
 * @param {type} str
 * @param {type} force
 * @returns {unresolved}
 */
 function capitalizeWord(str,force){
    str=force ? str.toLowerCase() : str;
    return str.replace(/^(.)|\s(.)/g, function($1){ return $1.toUpperCase( ); });
}

