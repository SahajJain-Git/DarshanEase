exports.getProducts = (req, res) => {
    res.json({
        products: [
            { id: 1, name: "Laptop" },
            { id: 2, name: "Phone" }
        ]
    });
};