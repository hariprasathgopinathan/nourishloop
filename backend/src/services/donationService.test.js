const mongoose = require('mongoose');
const { getMyClaims } = require('./donationService');
const User = require('../models/User');
const Donation = require('../models/Donation');

// Mock the models
jest.mock('../models/User');
jest.mock('../models/Donation');

describe('Donation Service - getMyClaims', () => {
  const validNgoId = new mongoose.Types.ObjectId().toString();
  const validDonorId = new mongoose.Types.ObjectId().toString();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('TEST 1 - Valid NGO should return formatted claims', async () => {
    // Arrange
    User.findById.mockResolvedValue({ _id: validNgoId, role: 'NGO' });

    const mockDonations = [
      {
        _id: 'claim1',
        status: 'CLAIMED',
        claimedBy: validNgoId,
        donorId: { name: 'Donor 1', organizationName: 'Org 1' }
      }
    ];

    const mockLean = jest.fn().mockResolvedValue(mockDonations);
    const mockSort = jest.fn().mockReturnValue({ lean: mockLean });
    const mockPopulate = jest.fn().mockReturnValue({ sort: mockSort });
    Donation.find.mockReturnValue({ populate: mockPopulate });

    // Act
    const result = await getMyClaims(validNgoId);

    // Assert
    expect(User.findById).toHaveBeenCalledWith(validNgoId);
    expect(Donation.find).toHaveBeenCalledWith({ claimedBy: validNgoId });
    expect(mockPopulate).toHaveBeenCalledWith('donorId', 'name organizationName -_id');
    expect(mockSort).toHaveBeenCalledWith({ claimedAt: -1 });
    
    expect(result).toHaveLength(1);
    expect(result[0]._id).toBe('claim1');
    expect(result[0].donorName).toBe('Donor 1');
    expect(result[0].donorOrganizationName).toBe('Org 1');
  });

  test('TEST 5 - Empty result (No 404)', async () => {
    // Arrange
    User.findById.mockResolvedValue({ _id: validNgoId, role: 'NGO' });

    const mockLean = jest.fn().mockResolvedValue([]);
    const mockSort = jest.fn().mockReturnValue({ lean: mockLean });
    const mockPopulate = jest.fn().mockReturnValue({ sort: mockSort });
    Donation.find.mockReturnValue({ populate: mockPopulate });

    // Act
    const result = await getMyClaims(validNgoId);

    // Assert
    expect(result).toEqual([]);
  });

  test('TEST 6 - DONOR USER should throw 403', async () => {
    // Arrange
    User.findById.mockResolvedValue({ _id: validNgoId, role: 'DONOR' });

    // Act & Assert
    await expect(getMyClaims(validNgoId)).rejects.toThrow('User is not an NGO');
    expect(Donation.find).not.toHaveBeenCalled();
  });

  test('TEST 7 - NONEXISTENT USER should throw 404', async () => {
    // Arrange
    User.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(getMyClaims(validNgoId)).rejects.toThrow('User not found');
    expect(Donation.find).not.toHaveBeenCalled();
  });

  test('TEST 8 - INVALID NGO ID should throw 400', async () => {
    // Arrange
    const invalidId = 'not-an-object-id';

    // Act & Assert
    await expect(getMyClaims(invalidId)).rejects.toThrow('Invalid ngoId format');
    expect(User.findById).not.toHaveBeenCalled();
  });

  test('TEST 9 - CROSS-NGO ISOLATION (Query explicitly targets ngoId)', async () => {
    // Arrange
    const ngoA = new mongoose.Types.ObjectId().toString();
    User.findById.mockResolvedValue({ _id: ngoA, role: 'NGO' });

    const mockLean = jest.fn().mockResolvedValue([]);
    const mockSort = jest.fn().mockReturnValue({ lean: mockLean });
    const mockPopulate = jest.fn().mockReturnValue({ sort: mockSort });
    Donation.find.mockReturnValue({ populate: mockPopulate });

    // Act
    await getMyClaims(ngoA);

    // Assert
    // Verify query explicitly restricts to ngoA
    expect(Donation.find).toHaveBeenCalledWith({ claimedBy: ngoA });
  });

  test('TEST 10 & 11 - MULTIPLE STATUS & SORTING', async () => {
    // Arrange
    User.findById.mockResolvedValue({ _id: validNgoId, role: 'NGO' });

    // Include multiple statuses
    const mockDonations = [
      { _id: 'd1', status: 'CLAIMED' },
      { _id: 'd2', status: 'READY_FOR_PICKUP' },
      { _id: 'd3', status: 'PICKED_UP' },
      { _id: 'd4', status: 'EXPIRED' },
      { _id: 'd5', status: 'CANCELLED' }
    ];

    const mockLean = jest.fn().mockResolvedValue(mockDonations);
    const mockSort = jest.fn().mockReturnValue({ lean: mockLean });
    const mockPopulate = jest.fn().mockReturnValue({ sort: mockSort });
    Donation.find.mockReturnValue({ populate: mockPopulate });

    // Act
    const result = await getMyClaims(validNgoId);

    // Assert
    // No status filter in find
    expect(Donation.find).toHaveBeenCalledWith({ claimedBy: validNgoId });
    // Sort is applied
    expect(mockSort).toHaveBeenCalledWith({ claimedAt: -1 });
    expect(result).toHaveLength(5);
  });

  test('TEST 12 - DONOR PRIVACY', async () => {
    // Arrange
    User.findById.mockResolvedValue({ _id: validNgoId, role: 'NGO' });

    const mockDonations = [
      {
        _id: 'd1',
        claimedBy: validNgoId,
        donorId: {
          name: 'The Donor',
          organizationName: 'The Org',
          email: 'donor@example.com',
          phone: '1234567890',
          role: 'DONOR',
          latitude: 10,
          longitude: 20
        }
      }
    ];

    const mockLean = jest.fn().mockResolvedValue(mockDonations);
    const mockSort = jest.fn().mockReturnValue({ lean: mockLean });
    const mockPopulate = jest.fn().mockReturnValue({ sort: mockSort });
    Donation.find.mockReturnValue({ populate: mockPopulate });

    // Act
    const result = await getMyClaims(validNgoId);

    // Assert
    expect(result).toHaveLength(1);
    const claim = result[0];
    
    // Explicitly expected fields
    expect(claim.donorName).toBe('The Donor');
    expect(claim.donorOrganizationName).toBe('The Org');

    // Expected excluded fields
    expect(claim.claimedBy).toBeUndefined(); // internal link removed
    expect(claim.donorId).toBeUndefined(); // full object removed
    expect(claim.email).toBeUndefined();
    expect(claim.phone).toBeUndefined();
    expect(claim.role).toBeUndefined();
    expect(claim.latitude).toBeUndefined();
    expect(claim.longitude).toBeUndefined();
  });
});

describe('Donation Service - markReadyForPickup and markPickedUp', () => {
  const validDonationId = new mongoose.Types.ObjectId().toString();
  const validDonorId = new mongoose.Types.ObjectId().toString();
  const validNgoId = new mongoose.Types.ObjectId().toString();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Helper: mock findOneAndUpdate returning null (atomic update rejected)
  // and findById returning a donation with the given status and correct ownership.
  const mockFailedAtomicUpdate = (existingDonation) => {
    const mockLean = jest.fn().mockResolvedValue(null);
    const mockPopulate = jest.fn().mockReturnValue({ lean: mockLean });
    Donation.findOneAndUpdate.mockReturnValue({ populate: mockPopulate });
    Donation.findById.mockResolvedValue(existingDonation);
  };

  describe('markReadyForPickup', () => {
    const { markReadyForPickup } = require('./donationService');

    test('TEST 1 - Valid READY-FOR-PICKUP', async () => {
      User.findById.mockResolvedValue({ _id: validDonorId, role: 'DONOR' });
      
      const mockUpdated = {
        _id: validDonationId,
        donorId: { name: 'Donor 1' },
        claimedBy: validNgoId,
        status: 'READY_FOR_PICKUP'
      };
      
      const mockLean = jest.fn().mockResolvedValue(mockUpdated);
      const mockPopulate = jest.fn().mockReturnValue({ lean: mockLean });
      Donation.findOneAndUpdate.mockReturnValue({ populate: mockPopulate });

      const result = await markReadyForPickup(validDonationId, validDonorId);

      expect(Donation.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: validDonationId, donorId: validDonorId, status: 'CLAIMED' },
        { $set: { status: 'READY_FOR_PICKUP' } },
        { new: true }
      );
      expect(result.status).toBe('READY_FOR_PICKUP');
      expect(result.donorName).toBe('Donor 1');
    });

    test('TEST 3 - WRONG DONOR (403)', async () => {
      User.findById.mockResolvedValue({ _id: validDonorId, role: 'DONOR' });
      const mockLean = jest.fn().mockResolvedValue(null); // update failed
      const mockPopulate = jest.fn().mockReturnValue({ lean: mockLean });
      Donation.findOneAndUpdate.mockReturnValue({ populate: mockPopulate });
      
      // Fallback check
      Donation.findById.mockResolvedValue({ _id: validDonationId, donorId: new mongoose.Types.ObjectId() });

      await expect(markReadyForPickup(validDonationId, validDonorId)).rejects.toThrow('Forbidden: You do not own this donation');
    });

    test('TEST 6 - NGO ATTEMPTS READY (403)', async () => {
      User.findById.mockResolvedValue({ _id: validNgoId, role: 'NGO' });
      await expect(markReadyForPickup(validDonationId, validNgoId)).rejects.toThrow('Only DONOR can mark ready for pickup');
    });

    // --- Explicit invalid transition tests for markReadyForPickup ---

    test('AVAILABLE → READY_FOR_PICKUP rejects 409', async () => {
      User.findById.mockResolvedValue({ _id: validDonorId, role: 'DONOR' });
      mockFailedAtomicUpdate({ _id: validDonationId, donorId: validDonorId, status: 'AVAILABLE' });

      await expect(markReadyForPickup(validDonationId, validDonorId)).rejects.toThrow('Invalid status transition');
      try { await markReadyForPickup(validDonationId, validDonorId); } catch (e) { expect(e.status).toBe(409); }
    });

    test('READY_FOR_PICKUP → READY_FOR_PICKUP rejects 409', async () => {
      User.findById.mockResolvedValue({ _id: validDonorId, role: 'DONOR' });
      mockFailedAtomicUpdate({ _id: validDonationId, donorId: validDonorId, status: 'READY_FOR_PICKUP' });

      await expect(markReadyForPickup(validDonationId, validDonorId)).rejects.toThrow('Invalid status transition');
    });

    test('PICKED_UP → READY_FOR_PICKUP rejects 409', async () => {
      User.findById.mockResolvedValue({ _id: validDonorId, role: 'DONOR' });
      mockFailedAtomicUpdate({ _id: validDonationId, donorId: validDonorId, status: 'PICKED_UP' });

      await expect(markReadyForPickup(validDonationId, validDonorId)).rejects.toThrow('Invalid status transition');
    });

    test('CANCELLED → READY_FOR_PICKUP rejects 409', async () => {
      User.findById.mockResolvedValue({ _id: validDonorId, role: 'DONOR' });
      mockFailedAtomicUpdate({ _id: validDonationId, donorId: validDonorId, status: 'CANCELLED' });

      await expect(markReadyForPickup(validDonationId, validDonorId)).rejects.toThrow('Invalid status transition');
    });

    test('EXPIRED → READY_FOR_PICKUP rejects 409', async () => {
      User.findById.mockResolvedValue({ _id: validDonorId, role: 'DONOR' });
      mockFailedAtomicUpdate({ _id: validDonationId, donorId: validDonorId, status: 'EXPIRED' });

      await expect(markReadyForPickup(validDonationId, validDonorId)).rejects.toThrow('Invalid status transition');
    });
  });

  describe('markPickedUp', () => {
    const { markPickedUp } = require('./donationService');

    test('TEST 2 - Valid PICKUP', async () => {
      User.findById.mockResolvedValue({ _id: validNgoId, role: 'NGO' });
      
      const mockUpdated = {
        _id: validDonationId,
        donorId: { name: 'Donor 1' },
        claimedBy: validNgoId,
        status: 'PICKED_UP',
        pickedUpAt: new Date()
      };
      
      const mockLean = jest.fn().mockResolvedValue(mockUpdated);
      const mockPopulate = jest.fn().mockReturnValue({ lean: mockLean });
      Donation.findOneAndUpdate.mockReturnValue({ populate: mockPopulate });

      const result = await markPickedUp(validDonationId, validNgoId);

      expect(Donation.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: validDonationId, claimedBy: validNgoId, status: 'READY_FOR_PICKUP' },
        { $set: { status: 'PICKED_UP', pickedUpAt: expect.any(Date) } },
        { new: true }
      );
      expect(result.status).toBe('PICKED_UP');
      expect(result.pickedUpAt).toBeDefined();
    });

    test('TEST 4 - WRONG NGO (403)', async () => {
      User.findById.mockResolvedValue({ _id: validNgoId, role: 'NGO' });
      const mockLean = jest.fn().mockResolvedValue(null);
      const mockPopulate = jest.fn().mockReturnValue({ lean: mockLean });
      Donation.findOneAndUpdate.mockReturnValue({ populate: mockPopulate });
      
      // Fallback check
      Donation.findById.mockResolvedValue({ _id: validDonationId, claimedBy: new mongoose.Types.ObjectId() });

      await expect(markPickedUp(validDonationId, validNgoId)).rejects.toThrow('Forbidden: You did not claim this donation');
    });

    test('TEST 5 - DONOR ATTEMPTS PICKUP (403)', async () => {
      User.findById.mockResolvedValue({ _id: validDonorId, role: 'DONOR' });
      await expect(markPickedUp(validDonationId, validDonorId)).rejects.toThrow('Only NGO can mark as picked up');
    });

    // --- Explicit invalid transition tests for markPickedUp ---

    test('AVAILABLE → PICKED_UP rejects 409', async () => {
      User.findById.mockResolvedValue({ _id: validNgoId, role: 'NGO' });
      mockFailedAtomicUpdate({ _id: validDonationId, claimedBy: validNgoId, status: 'AVAILABLE' });

      await expect(markPickedUp(validDonationId, validNgoId)).rejects.toThrow('Invalid status transition');
    });

    test('CLAIMED → PICKED_UP rejects 409 (skip state)', async () => {
      User.findById.mockResolvedValue({ _id: validNgoId, role: 'NGO' });
      mockFailedAtomicUpdate({ _id: validDonationId, claimedBy: validNgoId, status: 'CLAIMED' });

      await expect(markPickedUp(validDonationId, validNgoId)).rejects.toThrow('Invalid status transition');
    });

    test('PICKED_UP → PICKED_UP rejects 409', async () => {
      User.findById.mockResolvedValue({ _id: validNgoId, role: 'NGO' });
      mockFailedAtomicUpdate({ _id: validDonationId, claimedBy: validNgoId, status: 'PICKED_UP' });

      await expect(markPickedUp(validDonationId, validNgoId)).rejects.toThrow('Invalid status transition');
    });

    test('CANCELLED → PICKED_UP rejects 409', async () => {
      User.findById.mockResolvedValue({ _id: validNgoId, role: 'NGO' });
      mockFailedAtomicUpdate({ _id: validDonationId, claimedBy: validNgoId, status: 'CANCELLED' });

      await expect(markPickedUp(validDonationId, validNgoId)).rejects.toThrow('Invalid status transition');
    });

    test('EXPIRED → PICKED_UP rejects 409', async () => {
      User.findById.mockResolvedValue({ _id: validNgoId, role: 'NGO' });
      mockFailedAtomicUpdate({ _id: validDonationId, claimedBy: validNgoId, status: 'EXPIRED' });

      await expect(markPickedUp(validDonationId, validNgoId)).rejects.toThrow('Invalid status transition');
    });
  });
});

