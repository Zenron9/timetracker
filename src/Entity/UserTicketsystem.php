<?php declare(strict_types=1);

namespace App\Entity;

use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use App\Model\Base as Base;

#[ORM\Entity]
#[ORM\Table(name: 'users_ticket_systems')]
class UserTicketsystem extends Base
{
    #[ORM\Id]
    #[ORM\Column(type: Types::INTEGER)]
    #[ORM\GeneratedValue(strategy: 'AUTO')]
    protected $id;

    #[ORM\ManyToOne(targetEntity: 'TicketSystem', inversedBy: 'userTicketsystems')]
    protected $ticketSystem;

    #[ORM\ManyToOne(targetEntity: 'User', inversedBy: 'userTicketsystems')]
    protected $user;

    #[ORM\Column(type: Types::STRING, length: 50)]
    protected $accessToken;

    #[ORM\Column(type: Types::STRING, length: 50)]
    protected $tokenSecret;

    #[ORM\Column(type: Types::BOOLEAN)]
    protected $avoidConnection;

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param mixed $id
     *
     * @return $this
     */
    public function setId($id)
    {
        $this->id = $id;

        return $this;
    }

    /**
     * @return TicketSystem
     */
    public function getTicketSystem()
    {
        return $this->ticketSystem;
    }

    /**
     * @return $this
     */
    public function setTicketSystem(TicketSystem $ticketSystem)
    {
        $this->ticketSystem = $ticketSystem;

        return $this;
    }

    /**
     * @return User
     */
    public function getUser()
    {
        return $this->user;
    }

    /**
     * @return $this
     */
    public function setUser(User $user)
    {
        $this->user = $user;

        return $this;
    }

    /**
     * @return string
     */
    public function getAccessToken()
    {
        return $this->accessToken;
    }

    /**
     * @param string $accessToken
     *
     * @return $this
     */
    public function setAccessToken($accessToken)
    {
        $this->accessToken = $accessToken;

        return $this;
    }

    /**
     * @return string
     */
    public function getTokenSecret()
    {
        return $this->tokenSecret;
    }

    /**
     * @param string $tokenSecret
     *
     * @return $this
     */
    public function setTokenSecret($tokenSecret)
    {
        $this->tokenSecret = $tokenSecret;

        return $this;
    }

    /**
     * @return bool
     */
    public function getAvoidConnection()
    {
        return 1 === $this->avoidConnection;
    }

    /**
     * @param bool $avoidConnection
     *
     * @return $this
     */
    public function setAvoidConnection($avoidConnection)
    {
        $this->avoidConnection = ($avoidConnection ? 1 : 0);

        return $this;
    }
}
