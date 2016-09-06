## {customerId}/crypto ##
The crypto API allows you to retrieve a transaction specific public key from our server that should be used to encrypt sensitive data, like card details.
<div class="alert alert-info">You should always use the encryption functions provided in our SDKs even if you are not using any of the other functions provided by the SDKs. The implementation of encryption functionality can be tricky and small errors can have  big consequences.</div>

### publickey/get ###
The request does not have any additional input parameters.

#### responses ####
Please find below an overview of the possible responses.

##### 200 #####
The response contains the needed input for the encryption process.



## {customerId}/products ##
Through this API you can retrieve details of the payment products that are configured for your account.

### get ###
The returned payment products will be limited by the filters provided in the Create Session request.
<p>The list can be limited on a by-call basis by providing additional details on the transaction in the request. For example, you can request that only payment products that support recurring transactions will be returned when you are setting your user up for a recurring payment. You can also reduce the data that is returned in the response by hiding certain elements. This is done using the <span class="property">hide</span> field and allows the request to omit token details and/or the list of fields associated with each of the payment products.
<p>By submitting the <span class="property">locale</span> you can benefit from the server side language packs if your application does not have these or if you are using the JavaScript SDK. Note however that the values returned will be based on our default language packs and will not contain any specific modifications that you might have made through the Configuration Center. Our iOS and Android SDKs have language packs included which allows for easy management.

#### queryParameters ####
##### amount (12) #####
Whole amount in cents (not containing any decimals)
##### countryCode (2) #####
ISO 3166-1 alpha-2 country code.
##### currencyCode (3) #####
Three-letter ISO currency code representing the currency for the amount.
##### hide #####
Allows you to hide elements from the response, reducing the amount of data that will be returned to your client. Possible options are:
<ul>
<li>accountsOnFile - This will not return any data on stored tokens,
<li>fields - This will not return any field data of payment products.
</ul>
##### isRecurring #####
This allows you to filter payment products based on their support for recurring payments.
<ul>
<li>true - return only payment products that support recurring payments,
<li>false - return all payment products that support one-time transactions. Payment products that support recurring products are usually also part of this list.
</ul>
##### locale (5) #####
Locale used in the GUI towards the consumer. Please make sure that a language pack is configured for the locale you are submitting. If you don't submit a locale or submit one that is not set up on your account, we will use the default language pack for your account. You can easily upload additional language packs and set the default language pack in the Configuration Center.

##### responses #####
Please find below an overview of the possible responses

##### 200 #####
The response contains an array of payment products that match the filters supplied in the request.


### {paymentProductId}/get ###
Use this API if you are just interested in one payment product or if you have filtered out the fields in the <a href="#__customerId__products_get">Get payment products</a> call and you want to retrieve the field details on a single payment product. By doing it in this two-step process you will reduce the amount of data that needs to be transported back to your client, but you will have to make two calls. Usually the performance penalty is bigger when you need to do multiple calls with a small response package than one call with a bigger response package. You are however free to choose the best solution for your use case.

You can submit additional details on the transaction as filters. In that case, the payment product is returned only if it matches the filters, otherwise a 400 response is returned.

#### queryParameters ####
##### amount (12) #####
Amount in cents and always having 2 decimals
##### hide #####
Allows you to hide elements from the response, reducing the amount of data that needs to be returned to your client. Possible options are:
<ul>
<li>accountsOnFile - This will not return any data on stored tokens
<li>fields - This will not return any data on fields of the payment product
</ul>
##### isRecurring #####
This allows you to filter payment products based on their support for recurring or not
<ul><li>true
<li>false
</ul>
##### countryCode (2) #####
ISO 3166-1 alpha-2 country code
##### locale (5) #####
Locale used in the GUI towards the consumer. Please make sure that a language pack is configured for the locale you are submitting. If you submit a locale that is not setup on your account we will use the default language pack for your account. You can easily upload additional language packs and set the default language pack in the Configuration Center.
##### currencyCode (3) #####
Three-letter ISO currency code representing the currency for the amount

##### responses #####
Please find below an overview of the possible responses

##### 200 #####
The response contains the details of just one payment product

##### 400 #####
There was an error in the request, or the <span class="property">paymentProductId</a> you submitted does not exist or does not meet the filters you submitted.


### {paymentProductId}/directory/get ###
Certain payment products have directories that the consumer needs to pick from. The most well known example is the list of banks for iDeal that the consumer needs to select their bank from. iDeal is however not the only payment product for which this applies. If you have filtered out the fields in the GET payment products call you can retrieve only the directory entries associated with a single payment product using this call. If you are looking to get all details on all payment products including the entries of possible directories we encourage you to use the <a href="#__customerId__products_get">GET payment products</a> API call without the fields filter. Usually the performance penalty is bigger when you need to do multiple calls with a small response package than one call with a bigger response package. You are however free to choose the best solution for your use case.

#### queryParameters ####
##### currencyCode (3) #####
Three-letter ISO currency code representing the currency of the transaction
##### countryCode (2) #####
ISO 3166-1 alpha-2 country code

##### responses #####
Please find below an overview of the possible responses

##### 200 #####
An array of the directory entries is returned that can be used to populate the GUI element that allows the consumer to make the selection

##### 404 #####
When no directory can be found matching the input criteria a HTTP 404 response is returned 



## {customerId}/productgroups ##
Through this API you can retrieve payment product groups.
A payment product group has a collection of payment products that can be grouped together on a payment product selection page, and a set of fields to render on the payment product details page that allow to determine which payment product of the group the consumer wants to select.
We currently support one payment product group, named <span class="property">cards</span>, that has every credit card we support (and every debit card that behaves like a credit card).
Its <span class="property">cardNumber</span> field allows to determine the right payment product through a <a href="#__customerId__services_getIINdetails_post">Get IIN details</a> call.

### get ###
This service allows you to retrieve a list of every payment product group.
You can submit additional details on the transaction as filters. In that case, a group is included in the response only if it has at least one payment product that matches those filters. For example, when you are setting your user up for a recurring payment, this allows you to only have groups returned that have at least one payment product that supports recurring transactions.
The <span class="property">hide</span> field allows you to not have us return token details and/or the list of fields associated with each of the payment product groups.
<p>By submitting the <span class="property">locale</span> you can benefit from the server side language packs if your application does not have this or if you are using the JavaScript SDK. Note however that the values returned will be based on our default language packs and not on any modifications that you might have made through the Configuration Center. Our iOS and Android SDKs have language packs included that allow you to manage them easily.

#### queryParameters ####
##### amount (12) #####
Amount of the transaction in cents and always having 2 decimals
##### hide #####
Allows you to hide elements from the response, reducing the amount of data that needs to be returned to your client. Possible options are:
<ul>
<li>accountsOnFile - This will not return any account on file data of the tokens you provided when creating the session from your server.
<li>fields - This will not return any data on fields of the group
</ul>
##### isRecurring #####
Toggles filtering on support for recurring payments. Default value is false.
<ul>
<li>true - filter out groups that do not support recurring payments, where a group supports recurring payments if it has at least one payment product that supports recurring.
<li>false - do not filter
</ul>
##### countryCode (2) #####
ISO 3166-1 alpha-2 country code of the transaction
##### locale (5) #####
Locale used in the GUI towards the consumer. Please make sure that a language pack is configured for the locale you are submitting. If you submit a locale that is not set up on your account, we will use the default language pack for your account. You can easily upload additional language packs and set the default language pack in the Configuration Center.
##### currencyCode (3) #####
Three-letter ISO currency code representing the currency for the amount

##### responses #####
Please find below an overview of the possible responses

##### 200 #####
The response contains an array of payment product groups that match the filters supplied in the request.


### {paymentProductGroupId}/get ###
Use this service if you are just interested in a particular payment product group.
You can submit additional details on the transaction as filters. In that case, the group is returned only if it matches the filters, otherwise a 404 response is returned.

#### queryParameters ####
##### amount (12) #####
Amount  of the transaction in cents and always having 2 decimals
##### hide #####
Allows you to hide elements from the response, reducing the amount of data that needs to be returned to your client. Possible options are:
<ul>
<li>accountsOnFile - This will not return any account on file data of the tokens you provided when creating the session from your server.
<li>fields - This will not return any data on fields of the group
</ul>
##### isRecurring #####
This allows you to filter groups based on their support for recurring, where a group supports recurring if it has at least one payment product that supports recurring
<ul><li>true
<li>false
</ul>
##### countryCode (2) #####
ISO 3166-1 alpha-2 country code of the transaction
##### locale (5) #####
Locale used in the GUI towards the consumer. Please make sure that a language pack is configured for the locale you are submitting. If you submit a locale that is not setup on your account we will use the default language pack for your account. You can easily upload additional language packs and set the default language pack in the Configuration Center.
##### currencyCode (3) #####
Three-letter ISO currency code representing the currency for the amount

##### responses #####
Please find below an overview of the possible responses

##### 200 #####
The response contains the details of just one payment product group

##### 404 #####
The <span class="property">paymentProductGroupId</a> you submitted does not exist or does not match the filters you submitted.



## {customerId}/services ##

### getIINdetails/post ###
This call lets you verify if we can process a card from a certain Issuer (by looking up the first 6 digits) and what the best card type would be, based on your configuration. Some cards are dual branded and could be processed as either a local card (with a local brand) or an international card (with an international brand). In case you are not setup to process these local cards, this API call will not return that card type in its response.

#### body ####
As soon as the first 6 digits of the card number have been captured you can use this API to verify the card type and check if you can accept this card. The returned <span class="property">paymentProductId</span> can be used to provide visual feedback to the user by showing the appropriate payment product logo.

#### responses ####
Please find below an overview of the possible responses

##### 200 #####
The IIN submitted in your request matches a known card type that is configured for your account. The response contains information on that card type.

##### 404 #####
When the IIN does not match any of the products that are configured on your account an HTTP 404 response is returned. This means that we will not be able to process this card, most likely due to the fact that your account is not set up for certain specific card products that the consumer is trying to make the payment with. 


### convert/amount/get ###
Using the convert amount API you can ask our system to convert an amount from one currency into another currency. We will use the rate set configured for your account to perform the conversion. 
<div class="alert alert-info">All amount fields in our API are in cents with each amount having 2 decimals, regardless of the actual decimal places the currency has. So JPY has no decimals in it currency, but you will need to add two zeros as cents.</div>

#### queryParameters ####
##### source (3) #####
Three-letter ISO currency code representing the source currency
##### amount (12) #####
Amount to be converted in cents and always having 2 decimals
##### target (3) #####
Three-letter ISO currency code representing the target currency

##### responses #####
Please find below an overview of the possible responses

##### 200 #####
The response contains the converted amount


<!----------------- Object Dictionary ---------------------------->


## JSONSchema:APIError ##
Details on the error
### code @2(10) ###
Error code
### message @3(4000) ###
Human-readable error message that is not meant to be relayed to consumer as it might tip off people who are trying to commit fraud
### propertyName @4(4000) ###
In case the error was in relation to a property that was missing or not correct the name of the property in question is returned
### requestId @1(50) ###
ID of the request that can be used for debugging purposes
### httpStatusCode @5 ###
HTTP status code for this error that can be used to determine the type of error


## JSONSchema:AccountOnFile ##
Elements from the AccountsOnFile array
### id @1(50) ###
ID of the account on file record
### paymentProductId @2(5) ###
Payment product identifier
### displayHints @3 ###
Object containing information for the client on how best to display this field
### attributes @4 ###
Array containing the details of the stored token


## JSONSchema:AccountOnFileAttribute ##
### key ###
Name of the key or field
### value ###
Value of the key or field
### status ###
Possible values:
<ul><li>READ_ONLY - attribute cannot be updated and should be presented in that way to the user
<li>CAN_WRITE - attribute can be updated and should be presented as an editable field, for example an expiration date that will expire very soon
<li>MUST_WRITE - attribute should be updated and must be presented as an editable field, for example an expiration date that has already expired
</ul>
Any updated values that are entered for CAN_WRITE or MUST_WRITE will be used to update the values stored in the token.
### mustWriteReason ###
The reason why the status is MUST_WRITE. Currently only "IN_THE_PAST" is possible as value (for expiry date), but this can be extended with new values in the future.


## JSONSchema:AccountOnFileDisplayHints ##
Display hints for the stored token data
### labelTemplate ###
Array of attribute keys and their mask
### logo ###
Partial URL that you can reference for the image of this payment product. You can use our server-side resize functionality by appending '?size={{width}}x{{height}}' to the full URL, where width and height are specified in pixels. The resized image will always keep its correct aspect ratio.


## JSONSchema:AmountOfMoney ##
### amount @2(12)###
Amount in cents and always having 2 decimals
### currencyCode @1(3) ###
Three-letter ISO currency code representing the currency for the amount 


## JSONSchema:ConvertAmount ##
Output of the convert amount request
### convertedAmount (12) ###
Converted amount in cents 


## JSONSchema:Directory ##
output of the directory retrieval request
### entries ###
List of entries in the directory


## JSONSchema:DirectoryEntry ##
Definition of the array for the directory entries
### countryNames ###
Country name of the issuer, used to group issuers per country<br />
Note: this is only filled if supported by the payment product. 
### issuerId ###
Unique ID of the issuing bank of the consumer
### issuerList ###
To be used to sort the issuers.
<ul><li>short - These issuers should be presented at the top of the list
<li>long - These issuers should be presented after the issuers marked as short
</ul>
Note: this is only filled if supported by the payment product. Currently only iDeal (809) support this. Sorting within the groups should be done alphabetically.
### issuerName ###
Name of the issuing bank, as it should be presented to the consumer


## JSONSchema:EmptyValidator ##
A validator object that contains no additional properties.


## JSONSchema:ErrorResponse ##
Output for requests that resulted in a 4XX or 5XX HTTP response
### errorId (50) ###
Unique reference, for debugging purposes, of this error response
### errors ###
List of one or more errors


## JSONSchema:FixedListValidator ##
Definition of the list of fixed values that should be used in the validation
### allowedValues ###
List of the allowed values that the field will be validated against


## JSONSchema:GetIINDetailsRequest ##
Input for the retrieval of the IIN details request
### bin (19) ###
The first digits of the credit card number from left to right with a minimum of 6 digits, or the full credit card number
### paymentContext ###
Optional payment context to refine the IIN lookup to filter out payment products not applicable to your payment.


## JSONSchema:GetIINDetailsResponse ##
Output of the retrieval of the IIN details request
### countryCode @2(2) ###
The ISO 3166-1 alpha-2 country code of the country where the card was issued. If we don't know where the card was issued, then the countryCode will return the value '99'.
### paymentProductId @1(5) ###
The payment product identifier associated with the card. If the card has multiple brands, then we select the most appropriate payment product based on your configuration and the payment context, if you submitted one.
### isAllowedInContext ###
Populated only if you submitted a payment context.
<ul><li>true - The payment product is allowed in the submitted context.
<li>false - The payment product is not allowed in the submitted context. Note that in this case, none of the brands of the card will be allowed in the submitted context.</ul>
### coBrands ###
Populated only if the card has multiple brands.
A list with for every brand of the card, the payment product identifier associated with that brand, and if you submitted a payment context, whether that payment product is allowed in the context.


## JSONSchema:IINDetail ##
Output of the retrieval of the IIN details request
### paymentProductId @1(5) ###
Payment product identifier
### isAllowedInContext ###
Populated only if you submitted a payment context.
<ul><li>true - The payment product is allowed in the submitted context.
<li>false - The payment product is not allowed in the submitted context. Note that in this case, none of the brands of the card will be allowed in the submitted context.</ul>


## JSONSchema:KeyValuePair ##
Generic key value pair definition
### key ###
Name of the key or field
### value ###
Value of the key or field


## JSONSchema:LabelTemplateElement ##
Template of the label
### attributeKey ###
Name of the attribute that is shown to the consumer on selection pages or screens
### mask ###
Regular mask for the attributeKey<br />
Note: The mask is optional as not every field has a mask


## JSONSchema:LengthValidator ##
Definition of the length that should be used for the validation
### maxLength ###
The maximum allowed length
### minLength ###
The minimum allowed length


## JSONSchema:PaymentContext ##
Values that can optionally be set to refine an IIN Lookup
### amountOfMoney ###
The payment amount
### countryCode ###
The country the payment takes place in
### isRecurring ###
True if the payment is recurring


## JSONSchema:PaymentProduct ##
Definition of a payment product
### accountsOnFile ###
List of tokens for that payment product
### allowsRecurring ###
Indicates if the product supports recurring payments
<ul>
<li>true - This payment product supports recurring payments
<li>false - This payment product does not support recurring transactions and can only be used for one-off payments
</ul>
### allowsTokenization ###
Indicates if the payment details can be tokenized for future re-use
<ul>
<li>true - Payment details from payments done with this payment product can be tokenized for future re-use
<li>false - Payment details from payments done with this payment product can not be tokenized
</ul>
### autoTokenized ###
Indicates if the payment details can be automatically tokenized for future re-use
<ul>
<li>true - Payment details from payments done with this payment product can be automatically tokenized for future re-use
<li>false - Payment details from payments done with this payment product can not be automatically tokenized
</ul>
### displayHints ###
Object containing display hints like the order of the product when shown in a list, the name of the product and the logo
### fields ###
Object containing all the fields and their details that are associated with this payment product. If you are not interested in the data on the fields you should have us filter them our (using filter=fields in the query-string)
### id ###
The ID of the payment product in our system
### maxAmount ###
Maximum amount in EUR cents (using 2 decimals, so 1 EUR becomes 100 cents) for transactions done with this payment product
### minAmount ###
Minimum amount in EUR cents (using 2 decimals, so 1 EUR becomes 100 cents) for transactions done with this payment product
### mobileIntegrationLevel ###
This provides insight into the level of support for payments using a device with a smaller screen size. You can for instance use this to rank payment products differently on devices with a smaller screen. Possible values are:
<ul>
<li>BASIC_SUPPORT - The payment product has not optimized its user experience for devices with smaller screens
<li>OPTIMIZED_SUPPORT - The payment product offers a user experience that has been optimized for devices with smaller screens
</ul>
### usesRedirectionTo3rdParty ###
Indicates whether the payment product requires redirection to a third party to complete the payment. You can use this to filter out products that require a redirect if you don't want to support that.
<ul>
<li>true - Redirection is required
<li>false - No redirection is required
</ul>
### paymentMethod ###
Indicates which payment method will be used for this payment product. Payment method is one of:
<ul>
<li>card
<li>directDebit
<li>onlineBankTransfer
<li>invoice
<li>bankTransfer
<li>redirect
<li>cash
</ul>
### paymentProductGroup ###
The payment product group that has this payment product, if there is any. Not populated otherwise. Currently only one payment product group is supported:
<ul>
<li>cards
</ul>


## JSONSchema:PaymentProductDisplayHints ##
Display hints for the payment product
### displayOrder ###
Determines the order in which the payment products and groups should be shown (sorted ascending)
### label ###
Name of the payment product or group based on the locale that was included in the request
### logo ###
Partial URL that you can reference for the image of this payment product or group. You can use our server-side resize functionality by appending '?size={{width}}x{{height}}' to the full URL, where width and height are specified in pixels. The resized image will always keep its correct aspect ratio.


## JSONSchema:PaymentProductField ##
Details on the fields of payment products
### dataRestrictions ###
Object containing data restrictions that apply to this field, like minimum and/or maximum length
### displayHints ###
Object containing display hints for this field, like the order, mask, preferred keyboard
### id (256) ###
The ID of the field
### type ###
The type of field, possible values are:
<ul>
<li>string - Any UTF-8 chracter
<li>numericstring - A string that consisting only of numbers. Note that you should strip out anything that is not a digit, but leading zeros are allowed
<li>date - Date in the format DDMMYYYY
<li>expirationDate - Expiration date in the format MMYY
<li>integer - An integer
</ul>


## JSONSchema:PaymentProductFieldDataRestrictions ##
Details on the restrictions that should be imposed on the input data of the field 
### isRequired ###
<ul>
<li>true - Indicates that this field is required
<li>false - Indicates that this field is optional
</ul>
### validators ###
Object containing the details of the validations on the field


## JSONSchema:PaymentProductFieldDisplayHints ##
Display hints for the payment product field
### alwaysShow ###
<ul>
<li>true - Indicates that this field is advised to be captured to increase the success rates even-though it isn't marked as required. Please note that making the field required could hurt the success rates negatively. This boolean only indicates our advise to always show this field to the consumer.
<li>false - Indicates that this field is not to be shown unless it is a required field.
</ul>
### displayOrder ###
The order in which the fields should be shown (ascending)
### formElement ###
Object detailing the type of form element that should be used to present the field
### label ###
Label/Name of the field to used in the user interface
### mask ###
A mask that can be used in the input field. You can use it to inject additional characters to provide a better user experience and to restrict the accepted character set (illegal characters will be ignored during typing).<br />
* is used for wildcards (and also chars)<br />
9 is used for numbers<br />
Everything outside {{ and }} is used as-is.
### obfuscate ###
<ul>
<li>true - The data in this field should be obfuscated as it is entered, just like a password field
<li>false - The data in this field does not need to be obfuscated
</ul>
### placeholderLabel ###
A placeholder value for the form element
### preferredInputType ###
The type of keyboard that can best be used to fill out the value of this field. Possible values are:
<ul>
<li>PhoneNumberKeyboard - Keyboard that is normally used to enter phone numbers
<li>StringKeyboard - Keyboard that is used to enter strings
<li>IntegerKeyboard - Keyboard that is used to enter only numerical values
<li>EmailAddressKeyboard - Keyboard that allows easier entry of email addresses
</ul>
### tooltip ###
Object that contains an optional tooltip to assist the consumer


## JSONSchema:PaymentProductFieldFormElement ##
Form element details for payment product fields
### type ###
Type of form element to be used. The following types can be returned:
<ul>
<li>text - A normal text input field
<li>list - A list of values that the consumer needs to choose from is detailed in the <span class="property">valueMapping</span> array
<li>currency - Currency fields should be split into two fields, with the second one being specifically for the cents
</ul>
### valueMapping ###
An array of values and displayNames that should be used to populate the list object in the GUI


## JSONSchema:PaymentProductFieldTooltip ##
Tooltip definition for payment product fields
### image ###
Relative URL that can be used to retrieve an image for the tooltip image. 
### label ###
A text explaining the field in more detail. This is meant to be used for displaying to the consumer.


## JSONSchema:PaymentProductFieldValidators ##
Different validators linked to a payment product field
### emailAddress ###
Indicates that the content should be validated against the rules for an email address
### expirationDate ###
Indicates that the content should be validated against the rules for an expiration date (it should be in the future)
### fixedList ###
Indicates that content should be one of the, in this object, listed items
### length ###
Indicates that the content needs to be validated against length criteria defined in this object
### luhn ###
Indicates that the content needs to be validated using a LUHN check
### range ###
Indicates that the content needs to be validated against a, in this object, defined range
### regularExpression ###
A string representing the regular expression to check


## JSONSchema:PaymentProductGroup ##
Definition of the details of a single payment product group
### accountsOnFile ###
List of every account on file of every payment product that belongs to the group. 
If you are not interested in these accountsOnFile you can have us filter them our (using hide=accountsOnFile in the query-string) 
### displayHints ###
Object containing display hints like the order of the group when shown in a list, the name of the group and the logo. Note that the order of the group is the lowest order among the payment products that belong to the group. 
### fields ###
Object containing all the fields and their details that are associated with this payment product group. If you are not interested in the these fields you can have us filter them our (using hide=fields in the query-string)
### id ###
The ID of the payment product group in our system


## JSONSchema:PaymentProductGroupResponse ##


## JSONSchema:PaymentProductGroups ##
### paymentProductGroups ###
Array containing payment product groups and their characteristics


## JSONSchema:PaymentProductResponse ##
Definition of the details of a single payment product
### accountsOnFile ###
List of tokens for that payment product
### allowsRecurring ###
Indicates if the product supports recurring payments
<ul>
<li>true - This payment product supports recurring payments
<li>false - This payment product does not support recurring transactions and can only be used for one-off payments
</ul>
### allowsTokenization ###
Indicates if the payment details can be tokenized for future re-use
<ul>
<li>true - Payment details from payments done with this payment product can be tokenized for future re-use
<li>false - Payment details from payments done with this payment product can not be tokenized
</ul>
### autoTokenized ###
Indicates if the payment details can be automatically tokenized for future re-use
<ul>
<li>true - Payment details from payments done with this payment product can be automatically tokenized for future re-use
<li>false - Payment details from payments done with this payment product can not be automatically tokenized
</ul>
### displayHints ###
Object containing display hints like the order of the product when shown in a list, the name of the product and the logo
### fields ###
Object containing all the fields and their details that are associated with this payment product. If you are not interested in the data on the fields you should have us filter them our (using filter=fields in the query-string)
### id ###
The ID of the payment product in our system
### maxAmount ###
Maximum amount in EUR cents (using 2 decimals, so 1 EUR becomes 100 cents) for transactions done with this payment product
### minAmount ###
Minimum amount in EUR cents (using 2 decimals, so 1 EUR becomes 100 cents) for transactions done with this payment product
### mobileIntegrationLevel ###
This provides insight into the level of support for payments using a device with a smaller screen size. You can for instance use this to rank payment products differently on devices with a smaller screen. Possible values are:
<ul>
<li>NO_SUPPORT - The payment product does not work at all on a mobile device
<li>BASIC_SUPPORT - The payment product has not optimized its user experience for mobile devices
<li>OPTIMIZED_SUPPORT - The payment product offers a user experience that has been optimized for mobile devices
</ul>
### usesRedirectionTo3rdParty ###
Indicates whether the payment product requires redirection to a third party to complete the payment. You can use this to filter out products that require a redirect if you don't want to support that.
<ul>
<li>true - Redirection is required
<li>false - No redirection is required
</ul>


## JSONSchema:PaymentProducts ##
Array containing one or more payment products 
### paymentProducts ###
Array containing payment products and their characteristics


## JSONSchema:PublicKey ##
The returned details on the GET public key request
### keyId (255) ###
The identifier of the key that is used to encrypt sensitive data
### publicKey (1024) ###
The public key that is used to encrypt the sensitive data with. Only we have the privateKey and will be able to decrypt the encrypted payment details


## JSONSchema:RangeValidator ##
Definition of values that should be used for the validation of the field content
### maxValue ###
Upper value of the range that is still valid
### minValue ###
Lower value of the range that is still valid


## JSONSchema:RegularExpressionValidator ##
Definition of the regular expression that should be used for the validation of the field content
### regularExpression ###
Contains the regular expression that the value of the field needs to be validated against


## JSONSchema:ValueMappingElement ##
Details on the translation of front-end <span class="property">displayNames</span> to its corresponding back-end <span class="property">value</span>
### displayName ###
Key name
### value ###
Value corresponding to the key


<!----------------- Code examples -------------------------------->

## ios-example:{customerId}/crypto/publickey/get ##
// This example uses the AFNetworking framework (http://afnetworking.com/)
NSString *URLString = [NSString stringWithFormat:
    @"https://%@/client/%@/%@/crypto/publickey",
    @"{domainname}", @"{version}", @"{customerId}"];
AFHTTPRequestOperationManager *manager = [AFHTTPRequestOperationManager manager];
manager.requestSerializer = [AFJSONRequestSerializer serializer];
[manager.requestSerializer
    setValue:[NSString stringWithFormat:@"GCS v1Client:%@", @"{clientSessionId}"]
    forHTTPHeaderField:@"Authorization"];
manager.responseSerializer = [AFJSONResponseSerializer serializer];
[manager GET:URLString parameters:nil success:^(AFHTTPRequestOperation *operation, id responseObject) {
    NSDictionary *rawPublicKeyResponse = (NSDictionary *)responseObject;
    NSString *keyId = [rawPublicKeyResponse objectForKey:@"keyId"];
    NSString *encodedPublicKey = [rawPublicKeyResponse objectForKey:@"publicKey"];
    // Process public key.
} failure:^(AFHTTPRequestOperation *operation, NSError *error) {
    Log(@"Error while retrieving public key: %@", [error localizedDescription]);
    // Handle error.
}];

## android-example:{customerId}/crypto/publickey/get ##
// This example uses the GSON library for deserialising objects from JSON 
// (https://code.google.com/p/google-gson/)
String clientSessionId = "123";
String customerId      = "456";

String path            = customerId + "/crypto/publickey";
String location        = configuration.getBaseUrl() + path;
String header          = "GCS v1Client:" + clientSessionId;

try {
    URL url = new URL(location);
    HttpURLConnection connection = (HttpURLConnection)url.openConnection();
    connection.addRequestProperty("Authorization", header);

    if (connection.getResponseCode() != 200) {
        throw new CommunicationException("No status 200 received, status is: " +
                connection.getResponseCode());
    }

    Gson gson = new Gson();
    PublicKeyResponse publicKey = gson.fromJson(new InputStreamReader(
            connection.getInputStream()), PublicKeyResponse.class);

} catch (Exception e) {
    Log.i(TAG, "Error getting PublicKeyResponse:" + e.getMessage());
    // Handle error.
}

## javascript-example:{customerId}/crypto/publickey/get ##
var domainname = "demo"            // The sandbox, pre prod or prod domain of the Client API
    ,version = "v1"                // The version of the Client API
    ,customerId = "demo-123"       // See v1/{merchantId}/sessions Server API call
    ,clientSessionId = "demo-ABC"  // See v1/{merchantId}/sessions Server API call
    ,endpoint = "crypto/publickey"
    ,url = "https://" + domainname + "/client/" + version + "/" + customerId + "/" + endpoint;

// The code snippet below is written in plain JavaScript without the use of any external libraries. 
// It's meant for you to do some quick tests. It is by no means meant as  production code as it
// does not include error handling and won't work in all browsers. It's probably better to use our
// JavaScript SDK, or use an external library such as jQuery to do the actual request.
// A jQuery example is included further down.
var request = new XMLHttpRequest();
request.onload = loaded;
request.open("GET", url, true);
request.setRequestHeader("Authorization", "GCS v1Client:" + clientSessionId);
request.send();

function loaded() {
    var json = JSON.parse(this.responseText);
    console.log(json);
}

// Below is a jQuery example that does the same thing as the plainJavaScript example above. 
// This code is cross browser and has error handling included. This snippet could be used
// in production code in the case you use jQuery.
$.ajax({
    url: url
    ,type: "GET"
    ,dataType: "json"
    ,headers: {Authorization: "GCS v1Client:" + clientSessionId}
}).done(function(json) {
    // success!
    console.log(json);
}).fail(function(jqXHR, textStatus, errorThrown) {
    // the request failed
    console.log(jqXHR, textStatus, errorThrown);
});


## ios-example:{customerId}/products/get ##
// This example uses the AFNetworking framework (http://afnetworking.com/)
NSString *URLString = [NSString stringWithFormat:
    @"https://%@/client/%@/%@/products?countryCode=%@&currencyCode=%@&amount=%@&hide=fields&isRecurring=%@",
    @"{domainname}", @"{version}", @"{customerId}", @"{countryCode}", @"{currencyCode}", @"{amount}",
    @"{isRecurring}"];
AFHTTPRequestOperationManager *manager = [AFHTTPRequestOperationManager manager];
manager.requestSerializer = [AFJSONRequestSerializer serializer];
[manager.requestSerializer
    setValue:[NSString stringWithFormat:@"GCS v1Client:%@", @"{clientSessionId}"]
    forHTTPHeaderField:@"Authorization"];
manager.responseSerializer = [AFJSONResponseSerializer serializer];
[manager GET:URLString parameters:nil success:^(AFHTTPRequestOperation *operation, id responseObject) {
    NSArray *rawPaymentProducts = [(NSDictionary *)responseObject objectForKey:@"paymentProducts"];
    // Process payment products.
} failure:^(AFHTTPRequestOperation *operation, NSError *error) {
    Log(@"Error while retrieving payment products: %@", [error localizedDescription]);
    // Handle error.
}];

## android-example:{customerId}/products/get ##
// This example uses the GSON library for deserialising objects from JSON 
// (https://code.google.com/p/google-gson/)
String clientSessionId = "123";
String customerId      = "456";
String queryString     = "?countryCode=NL&amount=1000&isRecurring=false
                          &currencyCode=eur&hide=fields";

String path            = customerId + "/products";
String location        = configuration.getBaseUrl() + path + queryString;
String header          = "GCS v1Client:" + clientSessionId;

try {
    URL url = new URL(location);
    HttpURLConnection connection = (HttpURLConnection)url.openConnection();
    connection.addRequestProperty("Authorization", header);

    if (connection.getResponseCode() != 200) {
        throw new CommunicationException("No status 200 received, status is: " +
                connection.getResponseCode());
    }

    Gson gson = new Gson();
    PaymentProducts paymentProducts = gson.fromJson(new InputStreamReader(
            connection.getInputStream()), PaymentProducts.class);

} catch (Exception e) {
    Log.i(TAG, "Error getting PaymentProducts:" + e.getMessage());
    // Handle error.
}

## javascript-example:{customerId}/products/get ##
var domainname = "demo"            // The sandbox, pre prod or prod domain of the Client API
    ,version = "v1"                // The version of the Client API
    ,customerId = "demo-123"       // See v1/{merchantId}/sessions Server API call
    ,clientSessionId = "demo-ABC"  // See v1/{merchantId}/sessions Server API call
    ,endpoint = "products" 
    ,queryString = "?countryCode=NL&amount=1000&isRecurring=false&currencyCode=EUR&hide=fields"
    ,url = "https://" + domainname + "/client/" + version + "/" + customerId + "/" + endpoint + queryString;

// The code snippet below is written in plain JavaScript without the use of any external libraries. 
// It's meant for you to do some quick tests. It is by no means meant as  production code as it
// does not include error handling and won't work in all browsers. It's probably better to use our
// JavaScript SDK, or use an external library such as jQuery to do the actual request.
// A jQuery example is included further down.
var request = new XMLHttpRequest();
request.onload = loaded;
request.open("GET", url, true);
request.setRequestHeader("Authorization", "GCS v1Client:" + clientSessionId);
request.send();

function loaded() {
    var json = JSON.parse(this.responseText);
    console.log(json);
}

// Below is a jQuery example that does the same thing as the plainJavaScript example above. 
// This code is cross browser and has error handling included. This snippet could be used
// in production code in the case you use jQuery.
$.ajax({
    url: url
    ,type: 'GET'
    ,dataType: 'json'
    ,headers: {Authorization: 'GCS v1Client:' + clientSessionId}
}).done(function(json) {
    // success!
    console.log(json);
}).fail(function(jqXHR, textStatus, errorThrown) {
    // the request failed
    console.log(jqXHR, textStatus, errorThrown);
});


## ios-example:{customerId}/products/{paymentProductId}/get ##
// This example uses the AFNetworking framework (http://afnetworking.com/)
NSString *URLString = [NSString stringWithFormat:
    @"https://%@/client/%@/%@/products/%@/?countryCode=%@&currencyCode=%@&amount=%@&isRecurring=%@",
    @"{domainname}", @"{version}", @"{customerId}", @"{paymentProductId}", @"{countryCode}",
    @"{currencyCode}", @"{amount}", @"{isRecurring}"];
AFHTTPRequestOperationManager *manager = [AFHTTPRequestOperationManager manager];
manager.requestSerializer = [AFJSONRequestSerializer serializer];
[manager.requestSerializer
    setValue:[NSString stringWithFormat:@"GCS v1Client:%@", @"{clientSessionId}"]
    forHTTPHeaderField:@"Authorization"];
manager.responseSerializer = [AFJSONResponseSerializer serializer];
[manager GET:URLString parameters:nil success:^(AFHTTPRequestOperation *operation, id responseObject) {
    NSDictionary *rawPaymentProduct = (NSDictionary *)responseObject;
    // Process payment product.
} failure:^(AFHTTPRequestOperation *operation, NSError *error) {
    Log(@"Error while retrieving payment products: %@", [error localizedDescription]);
    // Handle error.
}];

## android-example:{customerId}/products/{paymentProductId}/get ##
// This example uses the GSON library for deserialising objects from JSON 
// (https://code.google.com/p/google-gson/)
String clientSessionId = "123";
String customerId      = "456";
String productId       = "789";
String queryString     = "?countryCode=NL&amount=1000&isRecurring=false&currencyCode=eur";

String path            = customerId + "/products/" + productId;
String location        = configuration.getBaseUrl() + path + queryString;
String header          = "GCS v1Client:" + clientSessionId;

try {
    URL url = new URL(location);
    HttpURLConnection connection = (HttpURLConnection)url.openConnection();
    connection.addRequestProperty("Authorization", header);

    if (connection.getResponseCode() != 200) {
        throw new CommunicationException("No status 200 received, status is: " +
                connection.getResponseCode());
    }

    Gson gson = new Gson();
    PaymentProduct paymentProduct = gson.fromJson(new InputStreamReader(
            connection.getInputStream()), PaymentProduct.class);

} catch (Exception e) {
    Log.i(TAG, "Error getting PaymentProduct:" + e.getMessage());
    // Handle error.
}

## javascript-example:{customerId}/products/{paymentProductId}/get ##
var domainname = "demo"            // The sandbox, pre prod or prod domain of the Client API
    ,version = "v1"                // The version of the Client API
    ,customerId = "demo-123"       // See v1/{merchantId}/sessions Server API call
    ,clientSessionId = "demo-ABC"  // See v1/{merchantId}/sessions Server API call
    ,endpoint = "products/1"       // 1 is the payment product id of VISA
    ,queryString = "?countryCode=NL&currencyCode=EUR"
    ,url = "https://" + domainname + "/client/" + version + "/" + customerId + "/" + endpoint + queryString;

// The code snippet below is written in plain JavaScript without the use of any external libraries. 
// It's meant for you to do some quick tests. It is by no means meant as  production code as it
// does not include error handling and won't work in all browsers. It's probably better to use our
// JavaScript SDK, or use an external library such as jQuery to do the actual request.
// A jQuery example is included further down.
var request = new XMLHttpRequest();
request.onload = loaded;
request.open("GET", url, true);
request.setRequestHeader("Authorization", "GCS v1Client:" + clientSessionId);
request.send();

function loaded() {
    var json = JSON.parse(this.responseText);
    console.log(json);
}

// Below is a jQuery example that does the same thing as the plainJavaScript example above. 
// This code is cross browser and has error handling included. This snippet could be used
// in production code in the case you use jQuery.
$.ajax({
    url: url
    ,type: "GET"
    ,dataType: "json"
    ,headers: {Authorization: "GCS v1Client:" + clientSessionId}
}).done(function(json) {
    // success!
    console.log(json);
}).fail(function(jqXHR, textStatus, errorThrown) {
    // the request failed
    console.log(jqXHR, textStatus, errorThrown);
});


## ios-example:{customerId}/products/{paymentProductId}/directory/get ##
// This example uses the AFNetworking framework (http://afnetworking.com/)
NSString *URLString = [NSString stringWithFormat:
    @"https://%@/client/%@/%@/products/%@/directory?countryCode=%@&currencyCode=%@",
    @"{domainname}", @"{version}", @"{customerId}", @"{paymentProductId}",
    @"{countryCode}", @"{currencyCode}"];
AFHTTPRequestOperationManager *manager = [AFHTTPRequestOperationManager manager];
manager.requestSerializer = [AFJSONRequestSerializer serializer];
[manager.requestSerializer 
    setValue:[NSString stringWithFormat:@"GCS v1Client:%@", @"{clientSessionId}"]
    forHTTPHeaderField:@"Authorization"];
manager.responseSerializer = [AFJSONResponseSerializer serializer];
[manager GET:URLString parameters:nil success:^(AFHTTPRequestOperation *operation, id responseObject) {
    NSArray *rawEntries = [(NSDictionary *)responseObject objectForKey:@"entries"];
    // Process entries.
} failure:^(AFHTTPRequestOperation *operation, NSError *error) {
    Log(@"Error while retrieving payment product directory: %@", [error localizedDescription]);
    // Handle error.
}];

## android-example:{customerId}/products/{paymentProductId}/directory/get ##
// This example uses the GSON library for deserialising objects from JSON 
// (https://code.google.com/p/google-gson/)

String clientSessionId = "123";
String customerId      = "456";
String productId       = "789";
String queryString     = "?countryCode=NL&currencyCode=eur";

String path            = customerId + "/products/" + productId + "/directory";
String location        = configuration.getBaseUrl() + path + queryString;
String header          = "GCS v1Client:" + clientSessionId;

try {
    URL url = new URL(location);
    HttpURLConnection connection = (HttpURLConnection)url.openConnection();
    connection.addRequestProperty("Authorization", header);

    if (connection.getResponseCode() != 200) {
        throw new CommunicationException("No status 200 received, status is: " +
                connection.getResponseCode());
    }

    Gson gson = new Gson();
    Directory directory = gson.fromJson(new InputStreamReader(
            connection.getInputStream()), Directory.class);

} catch (Exception e) {
    Log.i(TAG, "Error getting Directory:" + e.getMessage());
    // Handle error.
}

## javascript-example:{customerId}/products/{paymentProductId}/directory/get ##
var domainname = "demo"                  // The sandbox, pre prod or prod domain of the Client API
    ,version = "v1"                      // The version of the Client API
    ,customerId = "demo-123"             // See v1/{merchantId}/sessions Server API call
    ,clientSessionId = "demo-ABC"        // See v1/{merchantId}/sessions Server API call
    ,endpoint = "products/809/directory" // 809 is the payment product id of iDeal
    ,queryString = "?countryCode=NL&currencyCode=EUR"
    ,url = "https://" + domainname + "/client/" + version + "/" + customerId + "/" + endpoint + queryString;

// The code snippet below is written in plain JavaScript without the use of any external libraries. 
// It's meant for you to do some quick tests. It is by no means meant as  production code as it
// does not include error handling and won't work in all browsers. It's probably better to use our
// JavaScript SDK, or use an external library such as jQuery to do the actual request.
// A jQuery example is included further down.
var request = new XMLHttpRequest();
request.onload = loaded;
request.open("GET", url, true);
request.setRequestHeader("Authorization", "GCS v1Client:" + clientSessionId);
request.send();

function loaded() {
    var json = JSON.parse(this.responseText);
    console.log(json);
}

// Below is a jQuery example that does the same thing as the plainJavaScript example above. 
// This code is cross browser and has error handling included. This snippet could be used
// in production code in the case you use jQuery.
$.ajax({
    url: url
    ,type: "GET"
    ,dataType: "json"
    ,headers: {Authorization: "GCS v1Client:" + clientSessionId}
}).done(function(json) {
    // success!
    console.log(json);
}).fail(function(jqXHR, textStatus, errorThrown) {
    // the request failed
    console.log(jqXHR, textStatus, errorThrown);
});


## ios-example:{customerId}/services/getIINdetails/post ##
// This example uses the AFNetworking framework (http://afnetworking.com/)
NSString *URLString = [NSString stringWithFormat:
    @"https://%@/client/%@/%@/services/getIINdetails",
    @"{domainname}", @"{version}", @"{customerId}"];
AFHTTPRequestOperationManager *manager = [AFHTTPRequestOperationManager manager];
manager.requestSerializer = [AFJSONRequestSerializer serializer];
[manager.requestSerializer
    setValue:[NSString stringWithFormat:@"GCS v1Client:%@", @"{clientSessionId}"]
    forHTTPHeaderField:@"Authorization"];
manager.responseSerializer = [AFJSONResponseSerializer serializer];
NSMutableIndexSet *acceptableStatusCodes =
    [[NSMutableIndexSet alloc] initWithIndexSet:manager.responseSerializer.acceptableStatusCodes];
[acceptableStatusCodes addIndex:404];
manager.responseSerializer.acceptableStatusCodes = acceptableStatusCodes;
NSDictionary *parameters = @{@"bin": partialCardNumber};
[manager POST:URLString 
    parameters:parameters success:^(AFHTTPRequestOperation *operation, id responseObject) {
        NSDictionary *response = (NSDictionary *)responseObject;
        // Check whether the response is an error or an object containing a country code and
        // payment product identifier, and process it accordingly.
    } failure:^(AFHTTPRequestOperation *operation, NSError *error) {
        Log(@"Error while retrieving IIN details: %@", [error localizedDescription]);
        // Handle error.
    }];

## android-example:{customerId}/services/getIINdetails/post ##
// This example uses the GSON library for deserialising objects from JSON 
// (https://code.google.com/p/google-gson/)
String clientSessionId = "123";
String customerId      = "456";
String creditCardNr    = "415501"

String path            = customerId + "/services/getIINdetails/";
String location        = configuration.getBaseUrl() + path;
String header          = "GCS v1Client:" + clientSessionId;

try {
    URL url = new URL(location);
    HttpURLConnection connection = (HttpURLConnection)url.openConnection();
    connection.setRequestMethod("POST");
    connection.addRequestProperty("Content-Type", "application/json");
    connection.addRequestProperty("Authorization", header);

    Gson gson = new Gson();
    IinDetailsRequest iinRequest = new IinDetailsRequest(creditCardNr);
    String iinRequestJson = gson.toJson(iinRequest);

    connection.setDoOutput(true);
    connection.setFixedLengthStreamingMode(iinRequestJson.length());
    OutputStreamWriter writer = new OutputStreamWriter(connection.getOutputStream(), "UTF-8");
    writer.write(iinRequestJson)

    if (response.getResponseCode() != 200) {
        throw new CommunicationException("No status 200 received, status is: " +
                response.getResponseCode());
    }
    
    IinDetailsResponse iinDetailsResponse = gson.fromJson(new InputStreamReader(
            response.getInputStream()), IinDetailsResponse.class);

} catch (Exception e) {
    Log.i(TAG, "Error getting IinDetailsResponse:" + e.getMessage());
    // Handle error.
}

## javascript-example:{customerId}/services/getIINdetails/post ##
var domainname = "demo"                  // The sandbox, pre prod or prod domain of the Client API
    ,version = "v1"                      // The version of the Client API
    ,customerId = "demo-123"             // See v1/{merchantId}/sessions Server API call
    ,clientSessionId = "demo-ABC"        // See v1/{merchantId}/sessions Server API call
    ,endpoint = "services/getIINdetails" // The endpoint of this API call
    ,payload = {bin: "520953"}           // An object containing the first six digits of a credicard number
    ,url = "https://" + domainname + "/client/" + version + "/" + customerId + "/" + endpoint;

// The code snippet below is written in plain JavaScript without the use of any external libraries. 
// It's meant for you to do some quick tests. It is by no means meant as  production code as it
// does not include error handling and won't work in all browsers. It's probably better to use our
// JavaScript SDK, or use an external library such as jQuery to do the actual request.
// A jQuery example is included further down.
var request = new XMLHttpRequest();
request.onload = loaded;
request.open("POST", url, true);
request.setRequestHeader("Authorization", "GCS v1Client:" + clientSessionId);
request.setRequestHeader("Content-type", "application/json")
request.send(JSON.stringify(payload));

function loaded() {
    var json = JSON.parse(this.responseText);
    console.log(json);
}

// Below is a jQuery example that does the same thing as the plainJavaScript example above. 
// This code is cross browser and has error handling included. This snippet could be used
// in production code in the case you use jQuery.
$.ajax({
    url: url
    ,type: "POST"
    ,dataType: "json"
    ,contentType: "application/json"
    ,data: JSON.stringify(payload)
    ,headers: {Authorization: "GCS v1Client:" + clientSessionId}
}).done(function(json) {
    // success!
    console.log(json);
}).fail(function(jqXHR, textStatus, errorThrown) {
    // the request failed
    console.log(jqXHR, textStatus, errorThrown);
});


## ios-example:{customerId}/services/convert/amount/get ##
// This example uses the AFNetworking framework (http://afnetworking.com/)
NSString *URLString = [NSString stringWithFormat:
    @"https://%@/client/%@/%@/services/convert/amount?source=%@&target=%@&amount=%@",
    @"{domainname}", @"{version}", @"{customerId}", @"{sourceCurrencyCode}", @"{targetCurrencyCode}",
    @"{amount}"];
AFHTTPRequestOperationManager *manager = [AFHTTPRequestOperationManager manager];
manager.requestSerializer = [AFJSONRequestSerializer serializer];
[manager.requestSerializer
    setValue:[NSString stringWithFormat:@"GCS v1Client:%@", @"{clientSessionId}"]
    forHTTPHeaderField:@"Authorization"];
manager.responseSerializer = [AFJSONResponseSerializer serializer];
[manager GET:URLString parameters:nil success:^(AFHTTPRequestOperation *operation, id responseObject) {
    NSDictionary *rawConvertResponse = (NSDictionary *)responseObject;
    NSInteger *convertedAmount = [[rawConvertResponse objectForKey:@"convertedAmount"] integerValue];
    // Process converted amount.
} failure:^(AFHTTPRequestOperation *operation, NSError *error) {
    Log(@"Error while converting amount: %@", [error localizedDescription]);
    // Handle error.
}];

## android-example:{customerId}/services/convert/amount/get ##
// This example uses the GSON library for deserialising objects from JSON 
// (https://code.google.com/p/google-gson/)
String clientSessionId = "123";
String customerId      = "456";
String queryString     = "?source=EUR&target=dollar&USD=1000";

String path            = customerId + "/services/convert/amount";
String location        = configuration.getBaseUrl() + path + queryString;
String header          = "GCS v1Client:" + clientSessionId;

try {
    URL url = new URL(location);
    HttpURLConnection connection = (HttpURLConnection)url.openConnection();
    connection.addRequestProperty("Authorization", header);

    if (connection.getResponseCode() != 200) {
        throw new CommunicationException("No status 200 received, status is: " +
                response.getResponseCode());
    }

    Gson gson = new Gson();
    Integer convertedAmount = gson.fromJson(new InputStreamReader(
            response.getInputStream()), Integer.class);

} catch (Exception e) {
    Log.i(TAG, "Error converting amount:" + e.getMessage());
    // Handle error.
}

## javascript-example:{customerId}/services/convert/amount/get ##
var domainname = "demo"                   // The sandbox, pre prod or prod domain of the Client API
    ,version = "v1"                       // The version of the Client API
    ,customerId = "demo-123"              // See v1/{merchantId}/sessions Server API call
    ,clientSessionId = "demo-ABC"         // See v1/{merchantId}/sessions Server API call
    ,endpoint = "services/convert/amount"
    ,queryString = "?source=EUR&target=USD&amount=1000"
    ,url = "https://" + domainname + "/client/" + version + "/" + customerId + "/" + endpoint + queryString;

// The code snippet below is written in plain JavaScript without the use of any external libraries. 
// It's meant for you to do some quick tests. It is by no means meant as  production code as it
// does not include error handling and won't work in all browsers. It's probably better to use our
// JavaScript SDK, or use an external library such as jQuery to do the actual request.
// A jQuery example is included further down.
var request = new XMLHttpRequest();
request.onload = loaded;
request.open("GET", url, true);
request.setRequestHeader("Authorization", "GCS v1Client:" + clientSessionId);
request.send();

function loaded() {
    var json = JSON.parse(this.responseText);
    console.log(json);
}

// Below is a jQuery example that does the same thing as the plainJavaScript example above. 
// This code is cross browser and has error handling included. This snippet could be used
// in production code in the case you use jQuery.
$.ajax({
    url: url
    ,type: "GET"
    ,dataType: "json"
    ,headers: {Authorization: "GCS v1Client:" + clientSessionId}
}).done(function(json) {
    // success!
    console.log(json);
}).fail(function(jqXHR, textStatus, errorThrown) {
    // the request failed
    console.log(jqXHR, textStatus, errorThrown);
});


## ios-example:{customerId}/productgroups/get ##
// This example uses the AFNetworking framework (http://afnetworking.com/)
NSString *URLString = [NSString stringWithFormat:
    @"https://%@/client/%@/%@/productgroups?countryCode=%@&currencyCode=%@&amount=%@&hide=fields&isRecurring=%@",
    @"{domainname}", @"{version}", @"{customerId}", @"{countryCode}", @"{currencyCode}", @"{amount}",
    @"{isRecurring}"];
AFHTTPRequestOperationManager *manager = [AFHTTPRequestOperationManager manager];
manager.requestSerializer = [AFJSONRequestSerializer serializer];
[manager.requestSerializer
    setValue:[NSString stringWithFormat:@"GCS v1Client:%@", @"{clientSessionId}"]
    forHTTPHeaderField:@"Authorization"];
manager.responseSerializer = [AFJSONResponseSerializer serializer];
[manager GET:URLString parameters:nil success:^(AFHTTPRequestOperation *operation, id responseObject) {
    NSArray *rawPaymentProductGroups = [(NSDictionary *)responseObject objectForKey:@"paymentProductGroups"];
    // Process payment product groups.
} failure:^(AFHTTPRequestOperation *operation, NSError *error) {
    Log(@"Error while retrieving payment product groups: %@", [error localizedDescription]);
    // Handle error.
}];

## android-example:{customerId}/productgroups/get ##
// This example uses the GSON library for deserialising objects from JSON 
// (https://code.google.com/p/google-gson/)
String clientSessionId = "123";
String customerId      = "456";
String queryString     = "?countryCode=NL&amount=1000&isRecurring=false
                          &currencyCode=eur&hide=fields";

String path            = customerId + "/productgroups";
String location        = configuration.getBaseUrl() + path + queryString;
String header          = "GCS v1Client:" + clientSessionId;

try {
    URL url = new URL(location);
    HttpURLConnection connection = (HttpURLConnection)url.openConnection();
    connection.addRequestProperty("Authorization", header);

    if (connection.getResponseCode() != 200) {
        throw new CommunicationException("No status 200 received, status is: " +
                connection.getResponseCode());
    }

    Gson gson = new Gson();
    PaymentProductGroups paymentProductGroups = gson.fromJson(new InputStreamReader(
            connection.getInputStream()), PaymentProductGroups.class);

} catch (Exception e) {
    Log.i(TAG, "Error getting PaymentProductGroups:" + e.getMessage());
    // Handle error.
}

## javascript-example:{customerId}/productgroups/get ##
var domainname = "demo"            // The sandbox, pre prod or prod domain of the Client API
    ,version = "v1"                // The version of the Client API
    ,customerId = "demo-123"       // See v1/{merchantId}/sessions Server API call
    ,clientSessionId = "demo-ABC"  // See v1/{merchantId}/sessions Server API call
    ,endpoint = "productgroups" 
    ,queryString = "?countryCode=NL&amount=1000&isRecurring=false&currencyCode=EUR&hide=fields"
    ,url = "https://" + domainname + "/client/" + version + "/" + customerId + "/" + endpoint + queryString;

// The code snippet below is written in plain JavaScript without the use of any external libraries. 
// It's meant for you to do some quick tests. It is by no means meant as  production code as it
// does not include error handling and won't work in all browsers. It's probably better to use our
// JavaScript SDK, or use an external library such as jQuery to do the actual request.
// A jQuery example is included further down.
var request = new XMLHttpRequest();
request.onload = loaded;
request.open("GET", url, true);
request.setRequestHeader("Authorization", "GCS v1Client:" + clientSessionId);
request.send();

function loaded() {
    var json = JSON.parse(this.responseText);
    console.log(json);
}

// Below is a jQuery example that does the same thing as the plainJavaScript example above. 
// This code is cross browser and has error handling included. This snippet could be used
// in production code in the case you use jQuery.
$.ajax({
    url: url
    ,type: 'GET'
    ,dataType: 'json'
    ,headers: {Authorization: 'GCS v1Client:' + clientSessionId}
}).done(function(json) {
    // success!
    console.log(json);
}).fail(function(jqXHR, textStatus, errorThrown) {
    // the request failed
    console.log(jqXHR, textStatus, errorThrown);
});


## ios-example:{customerId}/productgroups/{paymentProductGroupId}/get ##
// This example uses the AFNetworking framework (http://afnetworking.com/)
NSString *URLString = [NSString stringWithFormat:
    @"https://%@/client/%@/%@/productgroups/%@/?countryCode=%@&currencyCode=%@&amount=%@&isRecurring=%@",
    @"{domainname}", @"{version}", @"{customerId}", @"{paymentProductGroupId}", @"{countryCode}",
    @"{currencyCode}", @"{amount}", @"{isRecurring}"];
AFHTTPRequestOperationManager *manager = [AFHTTPRequestOperationManager manager];
manager.requestSerializer = [AFJSONRequestSerializer serializer];
[manager.requestSerializer
    setValue:[NSString stringWithFormat:@"GCS v1Client:%@", @"{clientSessionId}"]
    forHTTPHeaderField:@"Authorization"];
manager.responseSerializer = [AFJSONResponseSerializer serializer];
[manager GET:URLString parameters:nil success:^(AFHTTPRequestOperation *operation, id responseObject) {
    NSDictionary *rawPaymentProductGroup = (NSDictionary *)responseObject;
    // Process payment product group.
} failure:^(AFHTTPRequestOperation *operation, NSError *error) {
    Log(@"Error while retrieving payment product group: %@", [error localizedDescription]);
    // Handle error.
}];

## android-example:{customerId}/products/{paymentProductId}/get ##
// This example uses the GSON library for deserialising objects from JSON 
// (https://code.google.com/p/google-gson/)
String clientSessionId = "123";
String customerId      = "456";
String productId       = "789";
String queryString     = "?countryCode=NL&amount=1000&isRecurring=false&currencyCode=eur";

String path            = customerId + "/productgroups/" + productGroupId;
String location        = configuration.getBaseUrl() + path + queryString;
String header          = "GCS v1Client:" + clientSessionId;

try {
    URL url = new URL(location);
    HttpURLConnection connection = (HttpURLConnection)url.openConnection();
    connection.addRequestProperty("Authorization", header);

    if (connection.getResponseCode() != 200) {
        throw new CommunicationException("No status 200 received, status is: " +
                connection.getResponseCode());
    }

    Gson gson = new Gson();
    PaymentProductGroup paymentProductGroup = gson.fromJson(new InputStreamReader(
            connection.getInputStream()), PaymentProductGroup.class);

} catch (Exception e) {
    Log.i(TAG, "Error getting PaymentProductGroup:" + e.getMessage());
    // Handle error.
}

## javascript-example:{customerId}/products/{paymentProductId}/get ##
var domainname = "demo"                // The sandbox, pre prod or prod domain of the Client API
    ,version = "v1"                    // The version of the Client API
    ,customerId = "demo-123"           // See v1/{merchantId}/sessions Server API call
    ,clientSessionId = "demo-ABC"      // See v1/{merchantId}/sessions Server API call
    ,endpoint = "productgroups/cards"  // cards is the payment product group id of credit- and debitcards
    ,queryString = "?countryCode=NL&currencyCode=EUR"
    ,url = "https://" + domainname + "/client/" + version + "/" + customerId + "/" + endpoint + queryString;

// The code snippet below is written in plain JavaScript without the use of any external libraries. 
// It's meant for you to do some quick tests. It is by no means meant as  production code as it
// does not include error handling and won't work in all browsers. It's probably better to use our
// JavaScript SDK, or use an external library such as jQuery to do the actual request.
// A jQuery example is included further down.
var request = new XMLHttpRequest();
request.onload = loaded;
request.open("GET", url, true);
request.setRequestHeader("Authorization", "GCS v1Client:" + clientSessionId);
request.send();

function loaded() {
    var json = JSON.parse(this.responseText);
    console.log(json);
}

// Below is a jQuery example that does the same thing as the plainJavaScript example above. 
// This code is cross browser and has error handling included. This snippet could be used
// in production code in the case you use jQuery.
$.ajax({
    url: url
    ,type: "GET"
    ,dataType: "json"
    ,headers: {Authorization: "GCS v1Client:" + clientSessionId}
}).done(function(json) {
    // success!
    console.log(json);
}).fail(function(jqXHR, textStatus, errorThrown) {
    // the request failed
    console.log(jqXHR, textStatus, errorThrown);
});
