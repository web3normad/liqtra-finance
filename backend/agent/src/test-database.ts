import { DatabaseService } from './services/database.service';

async function testDatabase() {
  console.log('🧪 Testing Database Service...\n');

  const db = new DatabaseService();

  try {
    // Test 1: Get active users
    console.log('Test 1: Get active users');
    const users = await db.getActiveUsers();
    console.log(`✅ Found ${users.length} active users`);
    console.log(users);

    // Test 2: Get protocols
    console.log('\nTest 2: Get protocols');
    const protocols = await db.getActiveProtocols();
    console.log(`✅ Found ${protocols.length} protocols`);
    console.log(protocols);

    // Test 3: Create test user
    console.log('\nTest 3: Create test user');
    const testUser = await db.createUser('0xTestAddress123', 'balanced');
    console.log('✅ User created:', testUser);

    // Test 4: Log action
    console.log('\nTest 4: Log action');
    await db.logAction({
      user_id: testUser.id,
      action_type: 'test_action',
      status: 'success',
      reason: 'Testing database service',
    });
    console.log('✅ Action logged');

    // Test 5: Get recent actions
    console.log('\nTest 5: Get recent actions');
    const actions = await db.getRecentActions(testUser.id, 5);
    console.log(`✅ Found ${actions.length} actions`);
    console.log(actions);

    console.log('\n✅ All database tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await db.close();
  }
}

testDatabase();
