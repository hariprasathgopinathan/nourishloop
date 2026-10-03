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
