local userKey = KEYS[1]
local now = tonumber(ARGV[1])
local period = tonumber(ARGV[2])
local userInfo = redis.call('HGETALL', userKey)
local reset = tonumber(userInfo[4])
local result = {}

if #userInfo == 0 or reset < now then
    reset = now + period
    redis.call('HSET', userKey, "count", 1, "reset", reset)
    result[1] = 1
    result[2] = reset
    result[3] = userKey
    return result
end

local count = tonumber(userInfo[2])
    local newCount = redis.call('HINCRBY', userKey, "count", 1)	
    result[1] = newCount
    result[2] = reset
    result[3] = userKey
    return result
