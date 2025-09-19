module.exports = function ({ models }) {
    const Currencies = models.use('Currencies');

    async function getAll(...data) {
        let where, attributes;
        for (const i of data) {
            if (typeof i !== 'object') throw new Error(global.getText("currencies", "needObjectOrArray"));
            if (Array.isArray(i)) attributes = i;
            else where = i;
        }
        try {
            const results = await Currencies.findAll({ where, attributes });
            return results.map(e => e.get({ plain: true }));
        } catch (error) {
            console.error(error);
            // মূল error অবজেক্টটি throw করলে stack trace ঠিক থাকে
            throw error;
        }
    }

    async function getData(userID) {
        try {
            const data = await Currencies.findOne({ where: { userID } });
            return data ? data.get({ plain: true }) : null; // null ফেরানো false-এর চেয়ে ভালো অভ্যাস
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async function setData(userID, options = {}) {
        if (typeof options !== 'object' || Array.isArray(options)) throw new Error(global.getText("currencies", "needObject"));
        try {
            // একটি ডাটাবেস কলে কাজটি সম্পন্ন করার জন্য
            const [affectedRows] = await Currencies.update(options, { where: { userID } });
            return affectedRows > 0; // সফলভাবে আপডেট হলে true ফিরবে
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async function delData(userID) {
        try {
            // একটি ডাটাবেস কলে কাজটি সম্পন্ন করার জন্য
            const affectedRows = await Currencies.destroy({ where: { userID } });
            return affectedRows > 0;
        } catch (error)
        {
            console.error(error);
            throw error;
        }
    }

    async function createData(userID, defaults = {}) {
        if (typeof defaults !== 'object' || Array.isArray(defaults)) throw new Error(global.getText("currencies", "needObject"));
        try {
            const [user, created] = await Currencies.findOrCreate({ where: { userID }, defaults });
            return { user: user.get({ plain: true }), created };
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async function increaseMoney(userID, amount) {
        if (typeof amount !== 'number' || amount <= 0) throw new Error(global.getText("currencies", "needPositiveNumber"));
        try {
            // Race condition এড়ানোর জন্য increment ব্যবহার করা হয়েছে
            await createData(userID); // যদি ব্যবহারকারী না থাকে, তৈরি করবে
            await Currencies.increment('money', { by: amount, where: { userID } });
            return true;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async function decreaseMoney(userID, amount) {
        if (typeof amount !== 'number' || amount <= 0) throw new Error(global.getText("currencies", "needPositiveNumber"));
        try {
            const user = await getData(userID);
            if (!user || user.money < amount) {
                return false; // অপর্যাপ্ত ব্যালেন্স
            }
            // Race condition এড়ানোর জন্য decrement ব্যবহার করা হয়েছে
            await Currencies.decrement('money', { by: amount, where: { userID } });
            return true;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async function increaseExp(userID, amount) {
        if (typeof amount !== 'number' || amount <= 0) throw new Error(global.getText("currencies", "needPositiveNumber"));
        try {
            await createData(userID); // যদি ব্যবহারকারী না থাকে, তৈরি করবে
            await Currencies.increment('exp', { by: amount, where: { userID } });
            return true;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    return {
        getAll,
        getData,
        setData,
        delData,
        createData,
        increaseMoney,
        decreaseMoney,
        increaseExp
    };
};
