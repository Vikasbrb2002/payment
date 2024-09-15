
## Build a basic version of PayTM

### Transactions in Mongoose
Transactions in MongoDB allow you to execute multiple operations (e.g., reads and writes) within a single, atomic unit of work. This means that either all operations succeed, and the changes are committed, or any operation fails, and all changes are rolled back. This is essential for maintaining data integrity, especially in complex operations like financial transactions.

## Key Terms and Methods
### startSession():

#### Purpose: To start a new session.
#### Usage: const session = await mongoose.startSession();
#### Explanation: This method initializes a new session, which is required to start a transaction. The session object will be used to track all operations within the transaction.

session.startTransaction():

#### Purpose: To begin a new transaction within the session.
#### Usage: session.startTransaction();
#### Explanation: This method starts a transaction within the context of the session. All subsequent operations performed with this session will be part of this transaction.

session.commitTransaction():

#### Purpose: To commit the transaction.
#### Usage: await session.commitTransaction();
#### Explanation: This method commits the transaction, making all the changes permanent. If all operations in the transaction are successful, this method should be called to apply the changes.

session.abortTransaction():

#### Purpose: To abort the transaction.
#### Usage: await session.abortTransaction();
#### Explanation: This method aborts the transaction, rolling back all changes made during the transaction. This is typically called when an error occurs, and you want to ensure that no partial changes are applied.

session.endSession():

#### Purpose: To end the session.
#### Usage: session.endSession();
#### Explanation: This method ends the session. It is good practice to end the session after committing or aborting the transaction to free up resources.

session(session):

#### Purpose: To associate an operation with a session.
#### Usage: Model.findOne(query).session(session)
#### Explanation: This method ensures that the operation is part of the session, and hence part of the transaction. All database operations that should be part of the transaction must include this.

--------------------------------------------------------------------------------------------------------------------------------------------


Here's a detailed explanation of how `session(session)` works and why it is used:

### What is a MongoDB Session?

A MongoDB session is a context within which multiple database operations can be executed as part of a single transaction. Transactions allow you to perform multiple reads and writes atomically, ensuring that either all operations complete successfully or none do. This is crucial for maintaining data consistency, especially in scenarios like financial transfers where partial updates could lead to inconsistencies.

### Usage of `session(session)`

When you pass a session object to a MongoDB operation using `.session(session)`, you are explicitly specifying that this operation should be part of the given session's transaction. Here is how it is used in your code:

1. **Starting the session and transaction**:
    ```javascript
    const session = await mongoose.startSession();
    session.startTransaction();
    ```

    This starts a new session and begins a transaction within that session.

2. **Fetching accounts within the transaction**:
    ```javascript
    const account = await Account.findOne({ userId: req.userId }).session(session);
    ```

    This ensures that the read operation to find the account is part of the transaction.

3. **Aborting the transaction on errors**:
    ```javascript
    if (!account || account.balance < amount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Insufficient balance"
        });
    }
    ```

    If any validation fails, the transaction is aborted, and no changes are made to the database.

4. **Performing the transfer within the transaction**:
    ```javascript
    await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
    await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);
    ```

    These update operations are also part of the transaction. They will either both succeed or both fail.

5. **Committing the transaction**:
    ```javascript
    await session.commitTransaction();
    ```

    If all operations are successful, the transaction is committed, making all changes permanent.

### Why Use `session(session)`?

Using `session(session)` ensures that all operations are executed within the context of the same transaction. This means:
- If any operation fails, the entire transaction can be aborted, and the database state will be rolled back to what it was before the transaction started.
- It ensures atomicity, consistency, isolation, and durability (ACID properties) of the operations, which is critical for operations that modify multiple documents.

In summary, `session(session)` is essential for ensuring that the operations within a transaction are executed as a single, atomic unit, thereby maintaining data integrity and consistency.