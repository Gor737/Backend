const {
  addAccountService,
  getAccountByIdService,
  updateAccountStatusService,
  depositAccountService,
  withdrawAccountService,
  transferAccountsService,
} = require("../services/accounts.service");

const addAccount = async (req, res, next) => {
  try {
    const { customer_id, currency } = req.body;
    if (!customer_id || !currency)
      return res
        .status(400)
        .send({ error: "customer_id and currency are required" });
    if (!["AMD", "USD", "EUR"].includes(currency))
      return res.status(400).send({ error: "currency must be AMD/USD/EUR" });
    
    const newAccount = {
      customer_id,
      currency
    };
    const response = await addAccountService(newAccount);
    return res.status(201).json(response);
  } catch (err) {
    next(err);
  }
};

const getAccountById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const account = await getAccountByIdService(Number(id));
    if (!account) return res.status(404).send({ error: "Account Not Found" });
    return res.status(200).json(account);
  } catch (err) {
    next(err);
  }
};

const updateAccountStatus = async(req,res, next) => {
    try{
        const {id} = req.params;
        const account = await getAccountByIdService(Number(id));
        if(!account) return res.status(404).send({error:"Account Not Found"});
        const {status} = req.body;
        if(!['active', 'frozen', 'closed'].includes(status))
            return res.status(400).send({error: "Bad status request"});
        const response = await updateAccountStatusService(id, status);
        res.status(200).json(response);
    }catch(err){
        next(err);
    }
}

const depositAccount = async (req,res,next) => {
    try{
        const {id} = req.params;
        const account = await getAccountByIdService(Number(id));
        if(!account) return res.status(404).send({error:"Account Not Found"});
        
        const { amount, reference, note } = req.body;
        if(!Number.isFinite(amount) || amount <= 0) return res.status(400).send({error:"Amount validation issue"});

        const response = await depositAccountService(Number(id), {amount, reference, note});
        res.status(200).json(response);
    }catch(err){
        next(err);
    }
}

const withdrawAccount = async(req,res, next) => {
    try{
        const {id} = req.params;
        const account = await getAccountByIdService(Number(id));
        if(!account) return res.status(404).send({error:"Account Not Found"});
        
        const { amount, reference, note } = req.body;
        if(!Number.isFinite(amount) || amount <= 0) return res.status(400).send({error:"Amount validation issue"});

        const response = await withdrawAccountService(Number(id), {amount, reference, note});
        res.status(200).json(response);
    }catch(err){
        next(err);
    }
}

const transferAccount = async (req,res,next) => {
    try{
        const {fromId, toId} = req.body;
        const { amount, reference, note } = req.body;
        if(!Number.isFinite(amount) || amount <= 0) return res.status(400).send({error:"Amount validation issue"});

        const response = await transferAccountsService(Number(fromId), Number(toId), {amount, reference, note});
        res.status(200).json(response);
    }catch(err){
        next(err);
    }
}

module.exports = { getAccountById, addAccount, updateAccountStatus, depositAccount, withdrawAccount, transferAccount};
