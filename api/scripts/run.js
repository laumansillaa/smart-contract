const main = async () => {
    //const [owner, randomPerson] = await hre.ethers.getSigners();
    // console.log('OWNER', owner)
    const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
    const waveContract = await waveContractFactory.deploy(); // Hardhat -> redlocal, que se destruye terminado el script
    //cada vez que se ejecute el contrato, se crea una cadena nueva.
    await waveContract.deployed();
    console.log('Contract deployed to: ', waveContract.address);
    // console.log('Contract deployed by: ', owner.address)

    // Hardhat Runtime Environment, o HRE para abreviar, es un objeto que contiene toda la funcionalidad que 
    // Hardhat expone cuando ejecuta una tarea, prueba o script. En realidad, Hardhat es el HRE.
    let waveCount;
    waveCount = await waveContract.getTotalWaves();
    console.log(waveCount.toNumber())

    let waveTxn = await waveContract.wave('A message!!');
    await waveTxn.wait(); //wait for the transaction to be mined

    const [_, randomPerson] = await hre.ethers.getSigners();
    waveTxn = await waveContract.connect(randomPerson).wave('Another message!!')

    await waveTxn.wait();

    // waveCount = await waveContract.getTotalWaves();

    // waveTxn = await waveContract.connect(randomPerson).wave();
    // console.log('waveContract.connecttt ------- ', waveTxn)

    let allWaves = await waveContract.getAllWaves();
    console.log('allWaves', allWaves)

    
    // waveCount = await waveContract.getTotalWaves();

   

};



const runMain = async () => {
    try {
        await main();
        process.exit(0); // exit Node process without error
    } catch (error) {
        console.log(error);
        process.exit(1); // exit Node process while indicating 'Uncaught Fatal Exception' error
    }
}


runMain();