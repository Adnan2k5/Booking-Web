import User from "../Models/UserModel.js"
export const handleSignUp = async (req, res) =>{
    try{
        const {id,email_addresses, first_name, last_name, created_at} = req.body.data;
        const extuser = await User.findOne({email: email_addresses[0]?.email_address});
        if(extuser){
            return res.status(400).json({message: "User already exists"})
        }
        const newUser  = new User({
            clerkId : id,
            email: email_addresses[0]?.email_address,
            name: `${first_name} ${last_name}`,
            createdAt: new Date(created_at * 1000)
        })
        await newUser.save();
        res.status(200).json({message: "User created successfully"})
    }
    catch(err){
        console.log(err);
        res.status(500).json({message: "Internal server error"})
    }
}