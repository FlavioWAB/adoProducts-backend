const bcrypt = require('bcryptjs');

const { User } = require('../../src/app/models');
const truncate = require('../utils/truncate');

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

        const user = await User.create(mockUser);
        const passwordIsEqual = await bcrypt.compare(mockUser.password, user.passwordHash);

        expect(passwordIsEqual).toBe(true);
    });
});