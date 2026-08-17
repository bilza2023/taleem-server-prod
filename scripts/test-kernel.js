import kernel from "../src/serverKernel/ServerKernel.js";

console.log("Kernel loaded.");

console.log("Modules:");
console.log("  auth:", !!kernel.auth);
console.log("  user:", !!kernel.user);
console.log("  admin:", !!kernel.admin);
console.log("  course:", !!kernel.course);
console.log("  library:", !!kernel.library);
console.log("  communication:", !!kernel.communication);
console.log("  subscription:", !!kernel.subscription);
console.log("  image:", !!kernel.image);
console.log("  audio:", !!kernel.audio);

await kernel.shutdown();

console.log("Kernel test passed.");