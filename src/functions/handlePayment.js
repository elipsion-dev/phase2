const ApiContracts = require('authorizenet').APIContracts;
const ApiControllers = require('authorizenet').APIControllers;
const SDKConstants = require('authorizenet').Constants;
const { handleError } = require("../helper/handleError");

const chargeCreditCard=async(paymentInfo)=>{
    const merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
    merchantAuthenticationType.setName(process.env.APILOGINID);
    merchantAuthenticationType.setTransactionKey(process.env.TRANSACTIONKEY);

        const creditCard = new ApiContracts.CreditCardType();
        creditCard.setCardNumber(paymentInfo.card_detail?.cardNumber);
        creditCard.setExpirationDate(paymentInfo.card_detail?.expirtationDate);
        creditCard.setCardCode(paymentInfo.card_detail?.cardCode);

        const paymentType = new ApiContracts.PaymentType();
        paymentType.setCreditCard(creditCard);

        const billTo = new ApiContracts.CustomerAddressType();
        billTo.setFirstName(paymentInfo.billing_detail?.firstName);
        billTo.setLastName(paymentInfo.billing_detail?.lastName);
        billTo.setAddress(paymentInfo.billing_detail?.address);
        billTo.setCity(paymentInfo.billing_detail?.city);
        billTo.setState(paymentInfo.billing_detail?.state);
        billTo.setZip(paymentInfo.billing_detail?.zip);
        billTo.setCountry(paymentInfo.billing_detail?.country);
        billTo.setEmail(paymentInfo.billing_detail?.email);

        const transactionRequestType = new ApiContracts.TransactionRequestType();
        transactionRequestType.setTransactionType(ApiContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION);
        transactionRequestType.setPayment(paymentType);
        transactionRequestType.setBillTo(billTo);
        transactionRequestType.setAmount(paymentInfo?.amount);

  const createRequest = new ApiContracts.CreateTransactionRequest();
  createRequest.setMerchantAuthentication(merchantAuthenticationType);
  createRequest.setTransactionRequest(transactionRequestType);
  
    const ctrl = new ApiControllers.CreateTransactionController(createRequest.getJSON());
    ctrl.setEnvironment(SDKConstants.endpoint.production);
    const excute_respone=new Promise((resolve, reject) => {
      ctrl.execute((error, res) => {
        const apiResponse = ctrl.getResponse();
        const response = new ApiContracts.CreateTransactionResponse(apiResponse);
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      });
    });
    const timeout=new Promise((resolve,reject)=>{
      setTimeout(() => {
        const error = new Error('This process take longer than expected, please try again ');
        error.statusCode = 408;
        reject(error);
      }, 47000);
    })
    const Response = await Promise.race(excute_respone,timeout)
    if (Response != null) {
      if (Response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK) {
        if(Response.getTransactionResponse().getMessages() != null){
          return Response.getTransactionResponse()
        }
        else {
					if(Response.getTransactionResponse().getErrors() != null){
						handleError(Response.getTransactionResponse().getErrors().getError()[0].getErrorText(),403);
					}
				}
      } else {
        if(Response.getTransactionResponse() != null && Response.getTransactionResponse().getErrors() != null){
          handleError(Response.getTransactionResponse().getErrors().getError()[0].getErrorText(),403);
        }
        else {
          handleError(Response.getMessages().getMessage()[0].getText(),403);
        }
      }
    }
    handleError("payment gatway not responding", 404);

}

const createCustomerProfile=async(user_info)=> {
	const merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();

  merchantAuthenticationType.setName(process.env.APILOGINID);
  merchantAuthenticationType.setTransactionKey(process.env.TRANSACTIONKEY);
	const creditCard = new ApiContracts.CreditCardType();
	creditCard.setCardNumber('4242424242424242');
	creditCard.setExpirationDate('0822');

	const paymentType = new ApiContracts.PaymentType();
	paymentType.setCreditCard(creditCard);
	
	const customerAddress = new ApiContracts.CustomerAddressType();
	customerAddress.setFirstName('test');
	customerAddress.setLastName('scenario');
	customerAddress.setAddress('123 Main Street');
	customerAddress.setCity('Bellevue');
	customerAddress.setState('WA');
	customerAddress.setZip('98004');
	customerAddress.setCountry('USA');
	customerAddress.setPhoneNumber('000-000-0000');

	const customerPaymentProfileType = new ApiContracts.CustomerPaymentProfileType();
	customerPaymentProfileType.setCustomerType(ApiContracts.CustomerTypeEnum.BUSINESS);
	customerPaymentProfileType.setPayment(paymentType);
	customerPaymentProfileType.setBillTo(customerAddress);

	const paymentProfilesList = [];
	paymentProfilesList.push(customerPaymentProfileType);

	const customerProfileType = new ApiContracts.CustomerProfileType();
	customerProfileType.setDescription('Profile description here');
	customerProfileType.setEmail('test@gmail.com');
	customerProfileType.setPaymentProfiles(paymentProfilesList);

	const createRequest = new ApiContracts.CreateCustomerProfileRequest();
	createRequest.setProfile(customerProfileType);
	createRequest.setValidationMode(ApiContracts.ValidationModeEnum.TESTMODE);
	createRequest.setMerchantAuthentication(merchantAuthenticationType);
	
	const ctrl = new ApiControllers.CreateCustomerProfileController(createRequest.getJSON());
 // ctrl.setEnvironment(SDKConstants.endpoint.production);
    const excute_respone = new Promise((resolve, reject) => {
      ctrl.execute((error, res) => {
        clearTimeout(timeout);
        const apiResponse = ctrl.getResponse();
        const response = new ApiContracts.CreateCustomerProfileResponse(apiResponse);
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      });
    });

    const timeout=new Promise((resolve,reject)=>{
      setTimeout(() => {
        const error = new Error('This process take longer than expected, please try again ');
        error.statusCode = 408;
        reject(error);
      }, 47000);
    })
   const Response=await Promise.race(excute_respone,timeout)
    if (Response != null) {
      if (Response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK) {
       return Response.getCustomerProfileId()
			} 
      else {
          handleError(Response.getMessages().getMessage()[0].getText(),403);
        }
      }
      handleError("payment gatway not responding", 404);
    }


    const createCustomerPaymentProfile=async (customerProfileId)=> {
      const merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
    
      merchantAuthenticationType.setName(process.env.APILOGINID);
      merchantAuthenticationType.setTransactionKey(process.env.TRANSACTIONKEY);
      const creditCard = new ApiContracts.CreditCardType();
      creditCard.setCardNumber('4242424242424242');
      creditCard.setExpirationDate('0822');
    
      const paymentType = new ApiContracts.PaymentType();
      paymentType.setCreditCard(creditCard);
      
      const customerAddress = new ApiContracts.CustomerAddressType();
      customerAddress.setFirstName('test');
      customerAddress.setLastName('scenario');
      customerAddress.setAddress('123 Main Street');
      customerAddress.setCity('Bellevue');
      customerAddress.setState('WA');
      customerAddress.setZip('98004');
      customerAddress.setCountry('USA');
      customerAddress.setPhoneNumber('000-000-0000');
    
      const profile = new ApiContracts.CustomerPaymentProfileType();
      profile.setBillTo(customerAddress);
      profile.setPayment(paymentType);

      const createRequest = new ApiContracts.CreateCustomerPaymentProfileRequest();
      createRequest.setMerchantAuthentication(merchantAuthenticationType);
      createRequest.setCustomerProfileId(customerProfileId);
      createRequest.setPaymentProfile(profile);
    
    
      const ctrl = new ApiControllers.CreateCustomerPaymentProfileController(createRequest.getJSON());
     // ctrl.setEnvironment(SDKConstants.endpoint.production);
        const excute_respone = new Promise((resolve, reject) => {
          ctrl.execute((error, res) => {
            clearTimeout(timeout);
            const apiResponse = ctrl.getResponse();
            const response = new ApiContracts.CreateCustomerPaymentProfileResponse(apiResponse);
            if (error) {
              reject(error);
            } else {
              resolve(response);
            }
          });
        });
    
        const timeout=new Promise((resolve,reject)=>{
          setTimeout(() => {
            const error = new Error('This process take longer than expected, please try again ');
            error.statusCode = 408;
            reject(error);
          }, 47000);
        })
       const Response=await Promise.race(excute_respone,timeout)
        if (Response != null) {
          if (Response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK) {
           return Response.getCustomerPaymentProfileId()
          } 
          else {
              handleError(Response.getMessages().getMessage()[0].getText(),403);
            }
          }
          handleError("payment gatway not responding", 404);
    }
    
    const chargeCreditCardExistingUser = async (paymentInfo, customerProfileId, customerPaymentProfileId) => {
      const merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
      merchantAuthenticationType.setName(process.env.APILOGINID);
      merchantAuthenticationType.setTransactionKey(process.env.TRANSACTIONKEY);
    
      const profileToCharge = new ApiContracts.CustomerProfilePaymentType();
      profileToCharge.setCustomerProfileId(customerProfileId);

      const paymentProfile = new ApiContracts.PaymentProfile();
      paymentProfile.setPaymentProfileId(customerPaymentProfileId);
      profileToCharge.setPaymentProfile(paymentProfile);
    
      const transactionRequestType = new ApiContracts.TransactionRequestType();
      transactionRequestType.setTransactionType(ApiContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION);
      transactionRequestType.setAmount(profileToCharge);
      transactionRequestType.setAmount(paymentInfo?.amount);
    
      const createRequest = new ApiContracts.CreateTransactionRequest();
      createRequest.setMerchantAuthentication(merchantAuthenticationType);
      createRequest.setTransactionRequest(transactionRequestType);
    
      const ctrl = new ApiControllers.CreateTransactionController(createRequest.getJSON());
      // ctrl.setEnvironment(SDKConstants.endpoint.production);
      const excute_respone = new Promise((resolve, reject) => {
        ctrl.execute((error, res) => {
          const apiResponse = ctrl.getResponse();
          const response = new ApiContracts.CreateTransactionResponse(apiResponse);
          if (error) {
            reject(error);
          } else {
            resolve(response);
          }
        });
      });
      const timeout = new Promise((resolve, reject) => {
        setTimeout(() => {
          const error = new Error('This process take longer than expected, please try again ');
          error.statusCode = 408;
          reject(error);
        }, 47000);
      });
      const Response = await Promise.race(excute_respone, timeout);
      if (Response != null) {
        if (Response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK) {
          if (Response.getTransactionResponse().getMessages() != null) {
            return Response.getTransactionResponse();
          } else {
            if (Response.getTransactionResponse().getErrors() != null) {
              handleError(Response.getTransactionResponse().getErrors().getError()[0].getErrorText(), 403);
            }
          }
        } else {
          if (Response.getTransactionResponse() != null && Response.getTransactionResponse().getErrors() != null) {
            handleError(Response.getTransactionResponse().getErrors().getError()[0].getErrorText(), 403);
          } else {
            handleError(Response.getMessages().getMessage()[0].getText(), 403);
          }
        }
      }
      handleError("payment gateway not responding", 404);
    }

    const createSubscriptionFromCustomerProfile=async(customerProfileId, customerPaymentProfileId, customerAddressId) =>{
      const merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
      merchantAuthenticationType.setName(process.env.APILOGINID);
      merchantAuthenticationType.setTransactionKey(process.env.TRANSACTIONKEY);
    
      const interval = new ApiContracts.PaymentScheduleType.Interval();
      interval.setLength(1);
      interval.setUnit(ApiContracts.ARBSubscriptionUnitEnum.MONTHS);
    
      const paymentScheduleType = new ApiContracts.PaymentScheduleType();
      paymentScheduleType.setInterval(interval);
      const startDate = new Date();
      paymentScheduleType.setStartDate(startDate);
      paymentScheduleType.setTotalOccurrences(5);//over all for 5 month
      paymentScheduleType.setTrialOccurrences(0);
    
      const customerProfileIdType = new ApiContracts.CustomerProfileIdType();
      customerProfileIdType.setCustomerProfileId(customerProfileId);
      customerProfileIdType.setCustomerPaymentProfileId(customerPaymentProfileId);
      customerProfileIdType.setCustomerAddressId(customerAddressId);
    
      const arbSubscription = new ApiContracts.ARBSubscriptionType();
      const subscriptionName = `RXMD-Subscription ${Date.now()}`;
      arbSubscription.setName(subscriptionName);
      arbSubscription.setPaymentSchedule(paymentScheduleType);
      arbSubscription.setAmount();
      arbSubscription.setProfile(customerProfileIdType);
    
      const createRequest = new ApiContracts.ARBCreateSubscriptionRequest();
      createRequest.setMerchantAuthentication(merchantAuthenticationType);
      createRequest.setSubscription(arbSubscription);
      const ctrl = new ApiControllers.ARBCreateSubscriptionController(createRequest.getJSON());
        // ctrl.setEnvironment(SDKConstants.endpoint.production);
        const excute_respone = new Promise((resolve, reject) => {
          ctrl.execute((error, res) => {
            const apiResponse = ctrl.getResponse();
            const response = new ApiContracts.ARBCreateSubscriptionResponse(apiResponse);
            if (error) {
              reject(error);
            } else {
              resolve(response);
            }
          });
        });
        const timeout = new Promise((resolve, reject) => {
          setTimeout(() => {
            const error = new Error('This process take longer than expected, please try again ');
            error.statusCode = 408;
            reject(error);
          }, 47000);
        });
        const Response = await Promise.race(excute_respone, timeout);
        if (Response != null) {
          if (Response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK) {
           return Response.getSubscriptionId()
          } 
          else {
              handleError(Response.getMessages().getMessage()[0].getText(),403);
            }
          }
          handleError("payment gatway not responding", 404);
    }
    
    const getSubscription=async(subscriptionId)=> {
      const merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
      merchantAuthenticationType.setName(process.env.APILOGINID);
      merchantAuthenticationType.setTransactionKey(process.env.TRANSACTIONKEY);
    
      const getRequest = new ApiContracts.ARBGetSubscriptionRequest();
      getRequest.setMerchantAuthentication(merchantAuthenticationType);
      getRequest.setSubscriptionId(subscriptionId);

        const ctrl = new ApiControllers.ARBGetSubscriptionController(getRequest.getJSON());
        // ctrl.setEnvironment(SDKConstants.endpoint.production);
        const excute_respone = new Promise((resolve, reject) => {
          ctrl.execute((error, res) => {
            const apiResponse = ctrl.getResponse();
            const response = new ApiContracts.ARBGetSubscriptionResponse(apiResponse);
            if (error) {
              reject(error);
            } else {
              resolve(response);
            }
          });
        });
        const timeout = new Promise((resolve, reject) => {
          setTimeout(() => {
            const error = new Error('This process take longer than expected, please try again ');
            error.statusCode = 408;
            reject(error);
          }, 47000);
        });
        const Response = await Promise.race(excute_respone, timeout);
        if (Response != null) {
          if (Response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK) {
           return Response.getSubscription()
          } 
          else {
              handleError(Response.getMessages().getMessage()[0].getText(),403);
            }
          }
          handleError("payment gatway not responding", 404);
    }
    const getSubscriptionStatus=async(subscriptionId)=> {
      const merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
      merchantAuthenticationType.setName(process.env.APILOGINID);
      merchantAuthenticationType.setTransactionKey(process.env.TRANSACTIONKEY);
    
      const getRequest = new ApiContracts.ARBGetSubscriptionStatusRequest();
      getRequest.setMerchantAuthentication(merchantAuthenticationType);
      getRequest.setSubscriptionId(subscriptionId);

        const ctrl = new ApiControllers.ARBGetSubscriptionStatusController(getRequest.getJSON());
        // ctrl.setEnvironment(SDKConstants.endpoint.production);
        const excute_respone = new Promise((resolve, reject) => {
          ctrl.execute((error, res) => {
            const apiResponse = ctrl.getResponse();
            const response = new ApiContracts.ARBGetSubscriptionStatusResponse(apiResponse);
            if (error) {
              reject(error);
            } else {
              resolve(response);
            }
          });
        });
        const timeout = new Promise((resolve, reject) => {
          setTimeout(() => {
            const error = new Error('This process take longer than expected, please try again ');
            error.statusCode = 408;
            reject(error);
          }, 47000);
        });
        const Response = await Promise.race(excute_respone, timeout);
        if (Response != null) {
          if (Response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK) {
           return Response.getStatus()
          } 
          else {
              handleError(Response.getMessages().getMessage()[0].getText(),403);
            }
          }
          handleError("payment gatway not responding", 404);
    }
    const updateSubscriptionPaymentAmount=async(subscriptionId)=> {
      const merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
      merchantAuthenticationType.setName(process.env.APILOGINID);
      merchantAuthenticationType.setTransactionKey(process.env.TRANSACTIONKEY);
    
      const arbSubscription = new ApiContracts.ARBSubscriptionType();
      arbSubscription.setSubscriptionId(subscriptionId);
      arbSubscription.setAmount(newAmount);

      const updateRequest = new ApiContracts.ARBUpdateSubscriptionRequest();
      updateRequest.setMerchantAuthentication(merchantAuthenticationType);
      updateRequest.setSubscription(arbSubscription);

     const ctrl = new ApiControllers.ARBUpdateSubscriptionController(updateRequest.getJSON());
      // ctrl.setEnvironment(SDKConstants.endpoint.production);
      const executeResponse = new Promise((resolve, reject) => {
        ctrl.execute((error, response) => {
          const apiResponse = ctrl.getResponse();
          const updateResponse = new ApiContracts.ARBUpdateSubscriptionResponse(apiResponse);
          if (error) {
            reject(error);
          } else {
            resolve(updateResponse);
          }
        });
      });
      const timeout = new Promise((resolve, reject) => {
        setTimeout(() => {
          const error = new Error('This process take longer than expected, please try again ');
          error.statusCode = 408;
          reject(error);
        }, 47000);
      });
      const response = await Promise.race(executeResponse, timeout);
      if (response != null) {
        if (response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK) {
          return response.getMessages().getMessage()[0].getText();
        } else {
          handleError(response.getMessages().getMessage()[0].getText(), 403);
        }
      }
      handleError("payment gateway not responding", 404);
    }

    const cancelSubscription=async(subscriptionId)=> {
      const merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
      merchantAuthenticationType.setName(process.env.APILOGINID);
      merchantAuthenticationType.setTransactionKey(process.env.TRANSACTIONKEY);
    
      const cancelRequest = new ApiContracts.ARBCancelSubscriptionRequest();
      cancelRequest.setMerchantAuthentication(merchantAuthenticationType);
      cancelRequest.setSubscriptionId(subscriptionId);

        const ctrl = new ApiControllers.ARBCancelSubscriptionController(getRequest.getJSON());
        // ctrl.setEnvironment(SDKConstants.endpoint.production);
        const excute_respone = new Promise((resolve, reject) => {
          ctrl.execute((error, res) => {
            const apiResponse = ctrl.getResponse();
            const response = new ApiContracts.ARBCancelSubscriptionResponse(apiResponse);
            if (error) {
              reject(error);
            } else {
              resolve(response);
            }
          });
        });
        const timeout = new Promise((resolve, reject) => {
          setTimeout(() => {
            const error = new Error('This process take longer than expected, please try again ');
            error.statusCode = 408;
            reject(error);
          }, 47000);
        });
        const Response = await Promise.race(excute_respone, timeout);
        if (Response != null) {
          if (Response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK) {
           return Response.getStatus()
          } 
          else {
              handleError(Response.getMessages().getMessage()[0].getText(),403);
            }
          }
          handleError("payment gatway not responding", 404);
    }

    const getCustomerAddressId=async(customerProfileId,customerPaymentProfileId)=> {
      const merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
      merchantAuthenticationType.setName(process.env.APILOGINID);
      merchantAuthenticationType.setTransactionKey(process.env.TRANSACTIONKEY);
    
      const getRequest = new ApiContracts.GetCustomerProfileRequest();
      getRequest.setCustomerProfileId(customerProfileId);
      getRequest.setMerchantAuthentication(merchantAuthenticationType);

        const ctrl = new ApiControllers.GetCustomerProfileController(getRequest.getJSON());
        // ctrl.setEnvironment(SDKConstants.endpoint.production);
        const excute_respone = new Promise((resolve, reject) => {
          ctrl.execute((error, res) => {
            const apiResponse = ctrl.getResponse();
            const response = new ApiContracts.GetCustomerProfileResponse(apiResponse);
            if (error) {
              reject(error);
            } else {
              resolve(response);
            }
          });
        });
        const timeout = new Promise((resolve, reject) => {
          setTimeout(() => {
            const error = new Error('This process take longer than expected, please try again ');
            error.statusCode = 408;
            reject(error);
          }, 47000);
        });
        const Response = await Promise.race(excute_respone, timeout);
        if (Response != null) {
          if (Response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK) {
            const customerProfile = response.getProfile();
            const customerPaymentProfiles = customerProfile.getPaymentProfiles().getPaymentProfile();
            const customerPaymentProfile = customerPaymentProfiles.
            find(profile => profile.getCustomerPaymentProfileId() === customerPaymentProfileId);
            if (customerPaymentProfile) {
              const customerAddressId = customerPaymentProfile.getBillTo().getCustomerAddressId();
              return customerAddressId;
            } else {
              handleError('Customer payment profile not found', 404);
            }
          } else {
            handleError(Response.getMessages().getMessage()[0].getText(), 403);
          }
        }
          handleError("payment gatway not responding", 404);
    }

    module.exports={
      chargeCreditCard,
      createCustomerProfile,
      createCustomerPaymentProfile,
      chargeCreditCardExistingUser,
      createSubscriptionFromCustomerProfile,
      getSubscription,
      getSubscriptionStatus,
      updateSubscriptionPaymentAmount,
      cancelSubscription,
      getCustomerAddressId
    }
    