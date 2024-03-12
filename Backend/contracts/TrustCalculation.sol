// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TrustCalculation {
    struct DeviceTrust {
        uint256 alpha;
        uint256 beta;
    }

    mapping(uint256 => DeviceTrust) public deviceTrustMapping;

    event LogCalculation(uint256 alphaNew, uint256 betaNew, uint256 satisfaction, uint256 trustFactor);

    function calculateTrustScore(
        uint256 deviceId,
        uint256 latency,
        uint256 responseTime,
        uint256 packetDeliveryRatio,
        uint256 satisfaction
    ) external {
        uint256 scaleFactor = 10**18; // Adjust according to your precision requirements

        // Ensure that satisfaction is within the valid range (0 or 1)
        require(satisfaction == 0 || satisfaction == 1, "Invalid satisfaction value");

        uint256 trustFactor = (
            (latency / 3) +
            (responseTime / 3) +
            (packetDeliveryRatio / 3)
        ) * scaleFactor; // Assuming equal weight for each parameter

        // Additional checks to prevent overflow or underflow
        require(trustFactor <= type(uint256).max / 2, "Trust factor overflow");
        require(deviceTrustMapping[deviceId].alpha <= type(uint256).max / 2, "Alpha overflow");
        require(deviceTrustMapping[deviceId].beta <= type(uint256).max / 2, "Beta overflow");

        uint256 alphaNew = (
            (deviceTrustMapping[deviceId].alpha * 2 + satisfaction * 2 + trustFactor) / 3
        );

        uint256 betaNew = (
            (deviceTrustMapping[deviceId].beta * 2 + (1 - satisfaction) * 2 + trustFactor) / 3
        );

        emit LogCalculation(alphaNew, betaNew, satisfaction, trustFactor);

        deviceTrustMapping[deviceId].alpha = alphaNew;
        deviceTrustMapping[deviceId].beta = betaNew;
    }

    function getTrustScore(uint256 deviceId) external view returns (uint256) {
        uint256 alpha = deviceTrustMapping[deviceId].alpha;
        uint256 beta = deviceTrustMapping[deviceId].beta;

        // Avoid division by zero, return a specific value (e.g., 50) when both alpha and beta are zero
        if (alpha + beta == 0) {
            return 50;
        }

        // Additional check to prevent division by zero
        require(alpha + beta <= type(uint256).max, "Alpha + Beta overflow");

        return (alpha * 100) / (alpha + beta);
    }
}
