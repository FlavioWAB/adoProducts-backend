const bcrypt = require('bcryptjs');

const truncate = require('../utils/truncate');
const factory = require('../utils/factories');

describe('Authentication', () => {
    beforeEach(async () => {
        await truncate();
    });

    it('should encrypt user password', async () => {
        const mockUser = {
            name: 'Ronaldo',
            email: 'meu@email.com',
            password: 'myhash'
        };

        const user = await factory.create('User', mockUser);

        const passwordIsEqual = await bcrypt.compare(mockUser.password, user.passwordHash);

        expect(passwordIsEqual).toBe(true);
    });

    
});